"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    function handleImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const files = event.target.files;

        if (!files || files.length === 0) return;

        const newImages = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setImages((previousImages) => [
            ...previousImages,
            ...newImages,
        ]);

        if (!selectedImage) {
            setSelectedImage(newImages[0]);
        }

        // Allow selecting the same files again
        event.target.value = "";
    }

    function removeImage(imageToRemove: string) {
        URL.revokeObjectURL(imageToRemove);

        setImages((previousImages) => {
            const remainingImages = previousImages.filter(
                (image) => image !== imageToRemove
            );

            if (selectedImage === imageToRemove) {
                setSelectedImage(
                    remainingImages.length > 0
                        ? remainingImages[0]
                        : null
                );
            }

            return remainingImages;
        });

        if (selectedImage === imageToRemove) {
            setIsFullScreen(false);
        }
    }

    function downloadImage(
        imageUrl: string,
        filename: string
    ) {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const image = new Image();

        image.onload = () => {
            const context = canvas.getContext("2d");

            if (!context) return;

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            context.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            context.drawImage(
                image,
                0,
                0,
                image.naturalWidth,
                image.naturalHeight
            );

            canvas.toBlob((blob) => {
                if (!blob) return;

                const downloadUrl =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = downloadUrl;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(downloadUrl);
            }, "image/png");
        };

        image.src = imageUrl;
    }

    function downloadSelectedImage() {
        if (!selectedImage) return;

        const index = images.indexOf(selectedImage);

        downloadImage(
            selectedImage,
            `devfest-photo-${index + 1}.png`
        );
    }

    async function downloadAllImages() {
        if (images.length === 0) return;

        setIsDownloadingAll(true);

        /*
         * Download each image separately.
         *
         * A small delay helps prevent the browser from
         * blocking multiple downloads at once.
         */
        for (let i = 0; i < images.length; i++) {
            downloadImage(
                images[i],
                `devfest-photo-${i + 1}.png`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );
        }

        setIsDownloadingAll(false);
    }

    // Close full-screen viewer with Escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsFullScreen(false);
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            images.forEach((image) => {
                URL.revokeObjectURL(image);
            });
        };
    }, [images]);

    return (
        <main className="min-h-screen bg-[#0b0f0e] text-white">

            {/* Background decoration */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">

                <div>

                    <p className="text-sm font-semibold tracking-[0.3em] text-green-400">
                        DEVFEST
                    </p>

                    <h1 className="text-xl font-bold tracking-tight">
                        Nairobi 2026
                    </h1>

                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur">
                    PHOTO FRAME
                </div>

            </header>

            {/* Main */}
            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl flex-col items-center px-6 py-10">

                {/* Intro */}
                <div className="mb-10 max-w-2xl text-center">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs font-medium text-green-300">

                        <span className="h-2 w-2 rounded-full bg-green-400" />

                        Create your DevFest photo

                    </div>

                    <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">

                        Put yourself in

                        <span className="block text-green-400">
              DevFest Nairobi.
            </span>

                    </h2>

                    <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
                        Upload your photos and create your personalized
                        DevFest Nairobi 2026 profile images.
                    </p>

                </div>

                {/* Editor card */}
                <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">

                    {/* Main editor */}
                    <div className="grid gap-8 md:grid-cols-[1fr_320px]">

                        {/* Preview */}
                        <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-6">

                            {selectedImage ? (

                                <div className="flex w-full flex-col items-center">

                                    {/* Main image */}
                                    <div className="w-full">

                                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">

                                            <img
                                                src={selectedImage}
                                                alt="Selected photo"
                                                className="mx-auto max-h-[550px] max-w-full object-contain"
                                            />

                                        </div>

                                        {/* Full screen */}
                                        <button
                                            onClick={() =>
                                                setIsFullScreen(true)
                                            }
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-green-400/40 hover:bg-green-400/10 hover:text-green-300"
                                        >

                      <span className="text-lg">
                        ⛶
                      </span>

                                            View full image

                                        </button>

                                    </div>

                                    {/* Add more */}
                                    <label
                                        htmlFor="add-more-images"
                                        className="mt-5 cursor-pointer text-sm font-medium text-zinc-400 transition hover:text-green-400"
                                    >

                                        + Add more photos

                                        <input
                                            id="add-more-images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                    </label>

                                </div>

                            ) : (

                                /* Empty upload state */
                                <label
                                    htmlFor="photo-upload"
                                    className="group flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 px-8 py-16 transition hover:border-green-400/50 hover:bg-green-400/[0.03]"
                                >

                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400/10 text-3xl transition group-hover:scale-110">
                                        📷
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        Upload your photos
                                    </h3>

                                    <p className="mt-2 text-center text-sm text-zinc-500">
                                        Choose one or multiple JPG, PNG or WEBP images
                                    </p>

                                    <span className="mt-6 rounded-full bg-green-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-green-300">
                    Choose photos
                  </span>

                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />

                                </label>

                            )}

                        </div>

                        {/* Controls */}
                        <div className="flex flex-col justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                    Your gallery
                                </p>

                                <h3 className="mt-2 text-2xl font-bold">
                                    Create your frame
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-zinc-400">
                                    Your photos stay on your device. Nothing
                                    needs to be uploaded to create your images.
                                </p>

                                {/* Photo count */}
                                {images.length > 0 && (

                                    <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">

                    <span className="text-sm text-zinc-400">
                      Photos
                    </span>

                                        <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-300">
                      {images.length}
                    </span>

                                    </div>

                                )}

                                {/* Controls */}
                                {selectedImage && (

                                    <div className="mt-5 space-y-4">

                                        {/* Zoom */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

                                            <div className="flex items-center justify-between">

                        <span className="text-sm text-zinc-300">
                          Zoom
                        </span>

                                                <span className="text-xs text-zinc-500">
                          100%
                        </span>

                                            </div>

                                            <input
                                                type="range"
                                                min="1"
                                                max="3"
                                                step="0.1"
                                                defaultValue="1"
                                                className="mt-4 w-full accent-green-400"
                                            />

                                        </div>

                                        {/* Frame */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

                                            <p className="text-sm text-zinc-300">
                                                Frame
                                            </p>

                                            <div className="mt-3 grid grid-cols-2 gap-2">

                                                <button className="rounded-lg border border-green-400/50 bg-green-400/10 px-3 py-2 text-xs font-medium text-green-300">
                                                    DevFest
                                                </button>

                                                <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/10">
                                                    Classic
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>

                            {/* Selected download */}
                            {selectedImage && (

                                <div className="mt-8">

                                    <button
                                        onClick={downloadSelectedImage}
                                        className="w-full rounded-xl bg-green-400 px-6 py-4 font-bold text-black shadow-lg shadow-green-400/10 transition hover:bg-green-300 hover:shadow-green-400/20 active:scale-[0.98]"
                                    >
                                        Download PNG
                                    </button>

                                    <p className="mt-3 text-center text-xs text-zinc-600">
                                        Download selected photo
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                    {/* Gallery */}
                    {images.length > 0 && (

                        <div className="mt-8 border-t border-white/10 pt-6">

                            {/* Gallery header */}
                            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                        Your photos
                                    </p>

                                    <p className="mt-1 text-sm text-zinc-400">
                                        Select a photo to edit
                                    </p>

                                </div>

                                <div className="flex flex-wrap gap-2">

                                    {/* Add photos */}
                                    <label
                                        htmlFor="gallery-upload"
                                        className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-green-400/30 hover:bg-green-400/10 hover:text-green-300"
                                    >

                                        + Add photos

                                        <input
                                            id="gallery-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                    </label>

                                    {/* Download all */}
                                    <button
                                        onClick={downloadAllImages}
                                        disabled={isDownloadingAll}
                                        className="rounded-lg bg-green-400 px-4 py-2 text-xs font-bold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {isDownloadingAll
                                            ? "Downloading..."
                                            : "↓ Download All"}

                                    </button>

                                </div>

                            </div>

                            {/* Gallery thumbnails */}
                            <div className="flex gap-3 overflow-x-auto pb-2">

                                {images.map((image, index) => (

                                    <div
                                        key={image}
                                        className="group relative flex-shrink-0"
                                    >

                                        {/* Thumbnail */}
                                        <button
                                            onClick={() =>
                                                setSelectedImage(image)
                                            }
                                            className={`relative h-24 w-20 overflow-hidden rounded-xl border-2 transition ${
                                                selectedImage === image
                                                    ? "border-green-400 ring-2 ring-green-400/20"
                                                    : "border-white/10 hover:border-white/30"
                                            }`}
                                        >

                                            <img
                                                src={image}
                                                alt={`Photo ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                            {/* Selected overlay */}
                                            {selectedImage === image && (

                                                <div className="absolute inset-0 bg-green-400/10" />

                                            )}

                                        </button>

                                        {/* Remove */}
                                        <button
                                            onClick={() =>
                                                removeImage(image)
                                            }
                                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black text-xs text-zinc-400 opacity-0 transition hover:bg-red-500 hover:text-white group-hover:opacity-100"
                                            aria-label={`Remove photo ${index + 1}`}
                                        >
                                            ×
                                        </button>

                                    </div>

                                ))}

                            </div>

                            {/* Gallery information */}
                            <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">

                <span>
                  {images.length}{" "}
                    {images.length === 1
                        ? "photo"
                        : "photos"}{" "}
                    in memory
                </span>

                                <span>
                  Downloads are saved individually
                </span>

                            </div>

                        </div>

                    )}

                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-zinc-600">
                    DevFest Nairobi 2026 • Built with Next.js
                </p>

            </section>

            {/* Hidden canvas */}
            <canvas
                ref={canvasRef}
                className="hidden"
            />

            {/* Full-screen viewer */}
            {isFullScreen && selectedImage && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setIsFullScreen(false)
                    }
                >

                    {/* Close */}
                    <button
                        onClick={() =>
                            setIsFullScreen(false)
                        }
                        className="absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl text-white transition hover:bg-white/20"
                        aria-label="Close full-screen image"
                    >
                        ×
                    </button>

                    {/* Image counter */}
                    <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-zinc-300">
                        {images.indexOf(selectedImage) + 1} /{" "}
                        {images.length}
                    </div>

                    {/* Image */}
                    <img
                        src={selectedImage}
                        alt="Full-screen preview"
                        className="max-h-[95vh] max-w-[95vw] object-contain"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    />

                </div>

            )}

        </main>
    );
}