'use client';

import { convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { RiFileUploadLine } from 'react-icons/ri';

type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles);
    }, [onChange]); // Add onChange to the dependency array

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className='file-upload'>
            <input {...getInputProps()} />
            {files && Array.isArray(files) && files.length > 0 && files[0] instanceof File ? (
                <Image
                    src={convertFileToUrl(files[0])}
                    width={1000}
                    height={1000}
                    alt='uploaded image'
                    className='max-h-[400px] overflow-hidden 
                    text-white object-cover'
                />
            ) : (
                <>
                    <RiFileUploadLine size={30} className='text-white' />
                    <div className='file-upload_label'>
                        <p className='text-14-regular'>
                            <span className='text-indigo-500 animate-pulse mr-2'>Click to upload</span> or drag and drop
                        </p>
                        <p>SVG, PNG, JPG or Gif (max 800x400)</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default FileUploader;