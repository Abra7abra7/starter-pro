import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Define bucket names
export const WINE_IMAGES_BUCKET = 'wine-images'
export const TASTING_IMAGES_BUCKET = 'tasting-images'

/**
 * Upload a single file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = ''
): Promise<string | null> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadFiles(
  files: File[],
  bucket: string,
  folder: string = '',
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const uploadedUrls: string[] = []
  const totalFiles = files.length

  for (let i = 0; i < files.length; i++) {
    const url = await uploadFile(files[i], bucket, folder)
    if (url) uploadedUrls.push(url)
    
    // Update progress if callback provided
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalFiles) * 100))
    }
  }

  return uploadedUrls
}

/**
 * Save wine image references to the database
 */
export async function saveWineImages(
  wineId: string,
  imageUrls: string[],
  makeFirstPrimary: boolean = true
): Promise<void> {
  try {
    const images = imageUrls.map((url, index) => ({
      wine_id: wineId,
      url,
      is_primary: makeFirstPrimary && index === 0,
      sort_order: index
    }))

    const { error } = await supabase
      .from('wine_images')
      .insert(images)

    if (error) throw error
  } catch (error) {
    console.error('Error saving wine images:', error)
  }
}

/**
 * Save tasting image references to the database
 */
export async function saveTastingImages(
  tastingId: string,
  imageUrls: string[],
  makeFirstPrimary: boolean = true
): Promise<void> {
  try {
    const images = imageUrls.map((url, index) => ({
      tasting_id: tastingId,
      url,
      is_primary: makeFirstPrimary && index === 0,
      sort_order: index
    }))

    const { error } = await supabase
      .from('tasting_images')
      .insert(images)

    if (error) throw error
  } catch (error) {
    console.error('Error saving tasting images:', error)
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(
  bucket: string,
  url: string
): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/')

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}
