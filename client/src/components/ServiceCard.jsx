const ServiceCard = ({ image, name, link }) => {
  const content = (
    <div className="shadow rounded overflow-hidden flex flex-col h-full">
        <div className="w-full h-[240px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-center hover:scale-105 transition"
          />
        </div>
        <p className="py-2 text-center font-semibold px-2 flex-grow line-clamp-2 text-black">
          {name}
        </p>
    </div>
  );

  return link ? (
    <a href={link} className="block h-full">
      {content}
    </a>
  ) : (
    content
  );
};


export default ServiceCard;
