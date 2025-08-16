import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Phone,
  Mail,
  Calendar,
  Package,
  ShoppingBag,
} from "lucide-react";
import type {
  ServiceType,
  ServiceOption,
} from "@/features/dashboard/services/types";
import AddWebinarForm from "@/features/dashboard/services/components/forms/AddWebinarForm";
import AddPriorityDmForm from "@/features/dashboard/services/components/forms/AddPriorityDmForm";
import AddDigitalProductForm from "@/features/dashboard/services/components/forms/AddDigitalProductForm";
import AddOneOnOneCallForm from "@/features/dashboard/services/components/forms/AddOneOnOneCallForm";
import AddPackageForm from "@/features/dashboard/services/components/forms/AddPackageForm";
import ServiceTypeCard from "@/features/dashboard/services/components/ui/ServiceTypeCard";

const AddServicePage = () => {
  const [selectedService, setSelectedService] =
    useState<ServiceType>("priority-dm");

  const serviceOptions: ServiceOption[] = [
    {
      type: "1-1-call",
      title: "1:1 Call",
      description: "Conduct 1:1 video sessions",
      icon: <Phone className="w-6 h-6" />,
    },
    {
      type: "priority-dm",
      title: "Priority DM",
      description: "Setup your priority inbox",
      icon: <Mail className="w-6 h-6" />,
    },
    {
      type: "webinar",
      title: "Webinar",
      description: "Host one time or recurring group sessions",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      type: "digital-product",
      title: "Digital Product",
      description: "Sell digital products, courses, paid videos & more",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      type: "package",
      title: "Package",
      description: "Bundle your offerings into one",
      icon: <Package className="w-6 h-6" />,
    },
  ];

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  const renderSpecificAddServiceForm = () => {
    switch (selectedService) {
      case "1-1-call":
        return <AddOneOnOneCallForm />;

      case "priority-dm":
        return <AddPriorityDmForm />;

      case "webinar":
        return <AddWebinarForm />;

      case "digital-product":
        return <AddDigitalProductForm />;

      case "package":
        return <AddPackageForm />;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Select Service Type
        </h1>
      </div>

      {/* Service Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {serviceOptions.map((service, index) => (
          <ServiceTypeCard
            key={index}
            service={service}
            selectedService={selectedService}
            handleServiceSelect={handleServiceSelect}
          />
        ))}
      </div>

      {/* Need Inspiration Section */}
      {/* <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Need inspiration?
          </h3>
          <Button variant="outline" className="bg-white">
            Use a template
          </Button>
        </CardContent>
      </Card> */}

      {/* Form Section */}
      <div className="space-y-6">
        {/* Service-specific fields */}
        {renderSpecificAddServiceForm()}
      </div>
    </div>
  );
};

export default AddServicePage;
