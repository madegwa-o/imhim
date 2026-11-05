"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [image, setImage] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    function handleImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    }

    function downloadImage() {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const link = document.createElement("a");

        link.download = "devfest-photo.png";
        link.href = canvas.toDataURL("image/png");

        link.click();
    }

    // Close full-screen viewer with Escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsFullScreen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#0b0f0e] text-white">

            {/* Background decoration */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
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

            {/* Main content */}
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
                        Upload your photo and create your personalized
                        DevFest Nairobi 2026 profile image.
                    </p>

                </div>

                {/* Editor card */}
                <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">

                    <div className="grid gap-8 md:grid-cols-[1fr_320px]">

                        {/* Preview */}
                        <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-6">

                            {!image ? (

                                /* Upload area */
                                <label
                                    htmlFor="photo-upload"
                                    className="group flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 px-8 py-16 transition hover:border-green-400/50 hover:bg-green-400/[0.03]"
                                >

                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400/10 text-3xl transition group-hover:scale-110">
                                        📷
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        Upload your photo
                                    </h3>

                                    <p className="mt-2 text-center text-sm text-zinc-500">
                                        Choose a JPG, PNG or WEBP image
                                    </p>

                                    <span className="mt-6 rounded-full bg-green-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-green-300">
                    Choose photo
                  </span>

                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />

                                </label>

                            ) : (

                                /* Image preview */
                                <div className="flex w-full flex-col items-center">

                                    <div className="w-full">

                                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">

                                            <img
                                                src={image}
                                                alt="Selected photo"
                                                className="mx-auto max-h-[550px] max-w-full object-contain"
                                            />

                                        </div>

                                        {/* Full screen button */}
                                        <button
                                            onClick={() => setIsFullScreen(true)}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-green-400/40 hover:bg-green-400/10 hover:text-green-300"
                                        >
                                            <span className="text-lg">⛶</span>
                                            View full image
                                        </button>

                                    </div>

                                    {/* Change photo */}
                                    <label
                                        htmlFor="change-photo"
                                        className="mt-5 cursor-pointer text-sm font-medium text-zinc-400 transition hover:text-green-400"
                                    >
                                        Change photo

                                        <input
                                            id="change-photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                </div>

                            )}

                        </div>

                        {/* Controls */}
                        <div className="flex flex-col justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                    Your photo
                                </p>

                                <h3 className="mt-2 text-2xl font-bold">
                                    Create your frame
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-zinc-400">
                                    Your photo stays on your device. Nothing
                                    needs to be uploaded to create the image.
                                </p>

                                {/* Controls */}
                                {image && (
                                    <div className="mt-8 space-y-4">

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

                            {/* Download */}
                            {image && (
                                <div className="mt-8">

                                    <button
                                        onClick={downloadImage}
                                        className="w-full rounded-xl bg-green-400 px-6 py-4 font-bold text-black shadow-lg shadow-green-400/10 transition hover:bg-green-300 hover:shadow-green-400/20 active:scale-[0.98]"
                                    >
                                        Download PNG
                                    </button>

                                    <p className="mt-3 text-center text-xs text-zinc-600">
                                        High-quality image • No upload required
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-zinc-600">
                    DevFest Nairobi 2026 • Built with Next.js
                </p>

            </section>

            {/* Hidden canvas */}
            <canvas
                ref={canvasRef}
                width={1080}
                height={1350}
                className="hidden"
            />

            {/* Full-screen image viewer */}
            {isFullScreen && image && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() => setIsFullScreen(false)}
                >

                    {/* Close button */}
                    <button
                        onClick={() => setIsFullScreen(false)}
                        className="absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl text-white transition hover:bg-white/20"
                        aria-label="Close full-screen image"
                    >
                        ×
                    </button>

                    {/* Full-screen image */}
                    <img
                        src={image}
                        alt="Full-screen preview"
                        className="max-h-[95vh] max-w-[95vw] object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />

                </div>
            )}

        </main>
    );
}