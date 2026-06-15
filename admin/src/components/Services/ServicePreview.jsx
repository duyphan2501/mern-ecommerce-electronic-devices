const ServicePreview = ({ service, compact = false }) => (
  <div
    className={`overflow-hidden rounded-xl bg-slate-100 ${
      compact ? "h-52" : "min-h-[360px]"
    }`}
  >
    {service.image ? (
      <img
        src={service.image}
        alt={service.name || "Service preview"}
        className={`w-full object-cover ${compact ? "h-36" : "h-64"}`}
      />
    ) : (
      <div
        className={`flex items-center justify-center text-sm font-semibold text-slate-400 ${
          compact ? "h-36" : "h-64"
        }`}
      >
        Add an image to preview this service
      </div>
    )}
    <div className="bg-white p-4 text-center">
      <p className="font-bold text-slate-900">
        {service.name || "Service name"}
      </p>
      {!compact && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-500">
          {service.description || "Optional service description"}
        </p>
      )}
    </div>
  </div>
);

export default ServicePreview;
