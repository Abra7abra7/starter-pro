import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { Button } from './button'
import { Loader2, Upload, X } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
  bucket: string
  folder: string
}

export function ImageUpload({ 
  onUploadComplete, 
  maxFiles = 5, 
  bucket = 'images',
  folder = 'products'
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit the number of files
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length)
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }, [files.length, maxFiles])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif']
    },
    maxFiles: maxFiles - files.length
  })
  
  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    
    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }
  
  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    const uploadedUrls: string[] = []
    const totalFiles = files.length
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `${folder}/${fileName}`
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) throw error
        
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath)
        
        uploadedUrls.push(urlData.publicUrl)
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100))
      }
      
      // Clean up previews
      previews.forEach(preview => URL.revokeObjectURL(preview))
      
      // Reset state
      setFiles([])
      setPreviews([])
      setUploadProgress(0)
      
      // Call callback with uploaded URLs
      onUploadComplete(uploadedUrls)
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive 
            ? 'Pustite súbory sem...' 
            : 'Pretiahnite sem obrázky alebo kliknite pre výber'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Podporované formáty: JPG, PNG, WebP, AVIF
        </p>
      </div>
      
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200">
                  <Image 
                    src={preview} 
                    alt={`Preview ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={uploadFiles} 
              disabled={isUploading}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Nahrávam... {uploadProgress}%
                </>
              ) : (
                'Nahrať obrázky'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
