import { faqs } from "@/data/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export default function Faq() {
  return (
    <section className="max-w-5xl mx-auto my-24">
      <h1 className="text-4xl text-center mb-12">FAQ</h1>
      <Accordion>
        {faqs.map((faq, index) => (
          <AccordionItem value={faq.value} key={index}>
            <AccordionTrigger className="cursor-pointer hover:bg-light-500 px-4">
              <h2 className="text-xl">{faq.question}</h2>
            </AccordionTrigger>
            {Array.isArray(faq.answer) ? (
              <AccordionContent className="">
                {faq.answer.map((answer, index) => (
                  <p key={index} className="text-base whitespace-pre-line px-4">
                    {answer}
                  </p>
                ))}
              </AccordionContent>
            ) : (
              <AccordionContent>
                <p className="text-base px-4">{faq.answer}</p>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
