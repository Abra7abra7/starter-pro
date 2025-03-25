-- Image Storage Migration
-- This migration adds tables for storing image references for wines and tastings
-- Compatible with the existing database schema

-- ======== IMAGE STORAGE ========

-- Wine images
CREATE TABLE "public"."wine_images" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "wine_id" uuid REFERENCES "public"."wines"(id) ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text,
  "is_primary" boolean DEFAULT false,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

ALTER TABLE "public"."wine_images" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wine images are viewable by everyone"
  ON "public"."wine_images"
  FOR SELECT
  USING (true);

CREATE POLICY "Wine images are insertable by authenticated users"
  ON "public"."wine_images"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Wine images are updatable by authenticated users"
  ON "public"."wine_images"
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Wine images are deletable by authenticated users"
  ON "public"."wine_images"
  FOR DELETE
  TO authenticated
  USING (true);

-- Tasting images
CREATE TABLE "public"."tasting_images" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "tasting_id" uuid REFERENCES "public"."tastings"(id) ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text,
  "is_primary" boolean DEFAULT false,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

ALTER TABLE "public"."tasting_images" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasting images are viewable by everyone"
  ON "public"."tasting_images"
  FOR SELECT
  USING (true);

CREATE POLICY "Tasting images are insertable by authenticated users"
  ON "public"."tasting_images"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Tasting images are updatable by authenticated users"
  ON "public"."tasting_images"
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Tasting images are deletable by authenticated users"
  ON "public"."tasting_images"
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure only one primary image per wine
CREATE OR REPLACE FUNCTION update_wine_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE "public"."wine_images"
    SET is_primary = false
    WHERE wine_id = NEW.wine_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_wine_image
BEFORE INSERT OR UPDATE ON "public"."wine_images"
FOR EACH ROW
EXECUTE FUNCTION update_wine_primary_image();

-- Ensure only one primary image per tasting
CREATE OR REPLACE FUNCTION update_tasting_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE "public"."tasting_images"
    SET is_primary = false
    WHERE tasting_id = NEW.tasting_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_tasting_image
BEFORE INSERT OR UPDATE ON "public"."tasting_images"
FOR EACH ROW
EXECUTE FUNCTION update_tasting_primary_image();
