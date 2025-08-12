
import Image from "next/image"

type Card = {
    title: string
    desc: string
    img: string
    href?: string
}

const CARDS: Card[] = [
    {
        title: "Eco- Lifestyle",
        desc:
            "Simple objects made meaningful. Our lifestyle range turns everyday habits into mindful rituals, helping you slow down and savor the small moments.",
        img: "https://botanicalbloom.in/images/Eco-Lifestyle.svg",
        href: "/collections/eco-lifestyle",
    },
    {
        title: "Botanical Skincare",
        desc:
            "Skincare that’s gentle to your skin and powerful in results—infused with the quiet strength of nature to make you feel confident in your own skin.",
        img: "https://botanicalbloom.in/images/Botanical-Skincare.svg",
        href: "/collections/botanical-skincare",
    },
    {
        title: "Seasonal Gifting",
        desc:
            "Gifting becomes personal again with handpicked, customizable boxes made for moments that matter—because giving should always feel this thoughtful.",
        img: "https://botanicalbloom.in/images/Seasonal-Gifting.svg",
        href: "/collections/seasonal-gifting",
    },
]

export default function NaturalCollection() {
    return (
        <section className="px-4 py-14">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl tracking-wide font-serif text-[#3c2f22]">
                    OUR NATURAL COLLECTION
                </h2>
                <p className="mt-2 text-sm md:text-base text-[#6b5a47]">
                    Crafted for a Conscious You
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CARDS.map((c) => (
                        <a
                            key={c.title}
                            href={c.href || "#"}
                            className="group rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            <div className="relative w-full h-56 md:h-64">
                                {/* Using external SVGs as images */}
                                <Image
                                    src={c.img}
                                    alt={c.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            <div className="px-6 pb-6 pt-5">
                                <h3 className="text-xl font-serif text-[#3c2f22] group-hover:opacity-90">
                                    {c.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-[#6b5a47]">
                                    {c.desc}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
