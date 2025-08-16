import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ServiceOption, ServiceType } from "../../types";

type ServiceTypeCardProps = {
  service: ServiceOption;
  selectedService: ServiceType;
  handleServiceSelect: (serviceType: ServiceType) => void;
};

const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({
  service,
  selectedService,
  handleServiceSelect,
}) => {
  return (
    <Card
      key={service.type}
      className={`cursor-pointer transition-all duration-200 hover:bg-[var(--card-hover)] ${
        selectedService === service.type ? "ring-1 ring-ring" : "border-border"
      }`}
      onClick={() => handleServiceSelect(service.type)}
    >
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-3">
          <div className="text-gray-500 dark:text-gray-400">{service.icon}</div>
        </div>
        <h3 className="font-medium text-sm mb-1">{service.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
          {service.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ServiceTypeCard;
