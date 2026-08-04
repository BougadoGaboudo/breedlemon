import { news } from "@/data/news";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export default function News() {
  return (
    <section className="max-w-5xl mx-auto my-24">
      <h1 className="text-4xl text-center mb-12">News</h1>
      <Accordion>
        {news.map((news, index) => (
          <AccordionItem value={news.value} key={index}>
            <AccordionTrigger className="cursor-pointer hover:bg-light-500 px-4">
              <h2 className="text-xl">{news.title}</h2>
            </AccordionTrigger>
            {Array.isArray(news.description) ? (
              <AccordionContent className="">
                {news.description.map((description, index) => (
                  <p key={index} className="text-base whitespace-pre-line px-4">
                    {description}
                  </p>
                ))}
              </AccordionContent>
            ) : (
              <AccordionContent>
                <p className="text-base px-4">{news.description}</p>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
