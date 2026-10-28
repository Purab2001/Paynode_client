// Unsplash photos used on the public site (free to use under the Unsplash License).
const unsplash = (id) => (w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const images = {
  teamLaptops: { src: unsplash("photo-1522071820081-009f0129c71c"), alt: "Team working together on laptops at a shared table" },
  hrPair: { src: unsplash("photo-1551836022-d5d88e9218df"), alt: "Two colleagues reviewing work on a laptop" },
  paperwork: { src: unsplash("photo-1554224155-6726b3ff858f"), alt: "Payroll paperwork with a calculator on a desk" },
  signing: { src: unsplash("photo-1450101499163-c8848c66ca85"), alt: "Manager signing off on a document" },
  cardPayment: { src: unsplash("photo-1563013544-824ae1b704d3"), alt: "Hands holding a payment card over a laptop" },
  collaborating: { src: unsplash("photo-1531482615713-2afd69097998"), alt: "Colleagues collaborating at a computer" },
  highFive: { src: unsplash("photo-1600880292203-757bb62b4baf"), alt: "Two coworkers celebrating at a meeting table" },
  planning: { src: unsplash("photo-1552664730-d307ca884978"), alt: "Team planning with sticky notes on a whiteboard" },
  smallMeeting: { src: unsplash("photo-1521737604893-d14cc237f11d"), alt: "Small team meeting around a table" },
  office: { src: unsplash("photo-1559136555-9303baea8ebd"), alt: "Open-plan office with people at their desks" },
  handsTogether: { src: unsplash("photo-1600880292089-90a7e086ee0c"), alt: "Colleagues joining hands in agreement" },
  brightDesk: { src: unsplash("photo-1497215728101-856f4ea42174"), alt: "Bright, quiet workspace with a laptop" },
  focusedDesk: { src: unsplash("photo-1553877522-43269d4ea984"), alt: "Person working at a laptop in a quiet office" },
};
