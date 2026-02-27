export default function WatermarkFooter() {
  return (
    <footer className="relative z-0 mt-auto shrink-0 w-full overflow-hidden flex flex-col items-center justify-end pointer-events-none">
      <div className="w-full flex justify-center translate-y-1/4">
        <h1
          className="text-[15vw] leading-none font-black tracking-tighter uppercase select-none"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Petabytes
        </h1>
      </div>
    </footer>
  );
}
