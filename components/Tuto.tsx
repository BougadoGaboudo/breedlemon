export default function Tuto() {
  return (
    <section className="max-w-5xl mx-auto my-24 px-4 md:px-0">
      <h1 className="text-2xl text-center mb-8">Tuto Breeding + Utilisation de Breedlemon</h1>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/iLo_TJwkHTU"
          title="Tutoriel Breedlemon"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
