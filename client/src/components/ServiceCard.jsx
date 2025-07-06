const ServiceCard = ({ image, name }) => {
  return (
      <div className="shadow rounded overflow-hidden flex flex-col h-full">
        <div className="w-full h-[240px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain hover:scale-105 transition"
          />
        </div>
        <p className="py-2 text-center font-semibold px-2 flex-grow line-clamp-2 text-black">
          {name}
        </p>
    </div>
  );
};


export default ServiceCard;
