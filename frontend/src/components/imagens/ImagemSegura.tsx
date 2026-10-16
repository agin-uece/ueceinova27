"use client";

import { useState } from "react";

interface ImagemSeguraProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ImagemSegura({ src, alt, className }: ImagemSeguraProps) {
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s";
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img 
            src={imgSrc} 
            alt={alt} 
            onError={() => setImgSrc(defaultImage)} 
            className={className} 
        />
    );
}