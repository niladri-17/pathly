import EmptyServiceCard from "@/features/dashboard/services/components/ui/EmptyServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/features/dashboard/services/components/ui/ServiceCard";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type OneOnOneCallServiceProp = {
  _id: string;
  title: string;
  duration: number;
  amount: number;
  isPublic: boolean;
};

const OneOnOneCallPage: React.FC = () => {
  const [services, setServices] = useState<OneOnOneCallServiceProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingServices, setDeletingServices] = useState<string[]>([]);

  const handleDelete = async (serviceId: string): Promise<void> => {
    setDeletingServices((prev) => [...prev, serviceId]);
    try {
      // await deleteService(serviceId);

      // Delay the UI update by 3 seconds
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          resolve();
          // reject("error");
        }, 3000)
      );

      setServices((prev) =>
        prev.filter((service) => service._id !== serviceId)
      );

      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Service deletion failed!", error);
      toast.error("Service deletion failed!");
    } finally {
      // setIsDeleting(false);
      setDeletingServices((prev) => prev.filter((id) => id !== serviceId));
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices([
        {
          _id: "qwe123123dwe",
          title: "1:1 Consultation",
          duration: 60,
          amount: 2500,
          isPublic: true,
        },
        {
          _id: "qe32234werw",
          title: "Mock Interview",
          duration: 1440,
          amount: 0,
          isPublic: true,
        },
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {isLoading ? (
          // Show skeleton loaders while isLoading
          <Skeleton className="bg-muted/50 aspect-video w-full max-w-sm rounded-lg" />
        ) : (
          services.length > 0 &&
          services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              isDeleting={deletingServices.includes(service._id)}
              handleDelete={handleDelete}
            />
          ))
        )}
      </div>

      {!isLoading && services.length === 0 && <EmptyServiceCard />}
    </div>
  );
};

export default OneOnOneCallPage;
