import { Button, ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset, Input } from '@/components';
import { Upload, XIcon } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';

type Props = {
  onChange?: (image: string | null) => void;
  value?: string | null;
};

const CircularImageCrop = ({ value, onChange }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(value ?? null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
      onChange?.(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
    onChange?.(null);
  };

  const handleCrop = (img: string) => {
    setCroppedImage(img);
    onChange?.(img);
    // Don't clear selectedFile immediately — allow crop to finish rendering
  };

  // 1. No file selected yet
  if (!selectedFile && !croppedImage) {
    return (
      <Button asChild variant="outline" className="relative w-fit border-dashed">
        <label>
          <Upload />
          Качи снимка
          <Input accept="image/*" className="sr-only" onChange={handleFileChange} type="file" />
        </label>
      </Button>
    );
  }

  // 2. Show final cropped image
  if (croppedImage) {
    return (
      <div className="flex items-center gap-2">
        <img alt="Cropped" className="overflow-hidden rounded-full" src={croppedImage} />
        <Button onClick={handleReset} size="icon" variant="ghost">
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  // 3. Show cropper
  return selectedFile ? (
    <div className="flex items-center gap-2">
      <ImageCrop aspect={1} circularCrop file={selectedFile} maxImageSize={1024 * 1024} onCrop={handleCrop}>
        <ImageCropContent className="max-w-md" />
        <div className="flex flex-col items-center gap-2">
          <Button onClick={handleReset} size="icon" variant="ghost">
            <XIcon className="size-4" />
          </Button>
          <ImageCropReset />
          <ImageCropApply />
        </div>
      </ImageCrop>
    </div>
  ) : null;
};

export { CircularImageCrop };
