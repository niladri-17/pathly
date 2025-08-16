import { useLocation, useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Enhanced breadcrumb configuration with dynamic support
interface BreadcrumbConfig {
  label: string | ((params: Record<string, string | undefined>) => string);
  to?: string | ((params: Record<string, string | undefined>) => string);
  isCurrentPage?: boolean;
}

// Resolved breadcrumb item (after function resolution)
interface ResolvedBreadcrumbItem {
  label: string;
  to?: string;
  isCurrentPage?: boolean;
}

// Define valid service types
const VALID_SERVICE_TYPES = ["1-1-call", "priority-dm", "webinar"] as const;
type ServiceType = (typeof VALID_SERVICE_TYPES)[number];

// Helper function to check if service type is valid
const isValidServiceType = (
  serviceType: string | undefined
): serviceType is ServiceType => {
  return (
    serviceType !== undefined &&
    VALID_SERVICE_TYPES.includes(serviceType as ServiceType)
  );
};

// Helper function to format service type for display
const formatServiceType = (serviceType: string): string => {
  const serviceTypeMap: Record<string, string> = {
    "1-1-call": "1-1 Call",
    "priority-dm": "Priority DM",
    webinar: "Webinar",
  };

  return (
    serviceTypeMap[serviceType] ||
    serviceType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const breadcrumbConfig: Record<string, BreadcrumbConfig[]> = {
  "/dashboard/home": [{ label: "Hi Niladri", isCurrentPage: true }],

  "/dashboard/bookings/pending": [
    { label: "Bookings", to: "/dashboard/bookings/pending" },
    { label: "Pending", isCurrentPage: true },
  ],

  "/dashboard/bookings/completed": [
    { label: "Bookings", to: "/dashboard/bookings/completed" },
    { label: "Completed", isCurrentPage: true },
  ],

  "/dashboard/services": [{ label: "Services", isCurrentPage: true }],

  "/dashboard/services/add": [
    { label: "Services", to: "/dashboard/services" },
    { label: "Add", isCurrentPage: true },
  ],

  "/dashboard/services/1-1-call": [
    { label: "Services", to: "/dashboard/services" },
    { label: "1-1 Call", isCurrentPage: true },
  ],

  "/dashboard/services/priority-dm": [
    { label: "Services", to: "/dashboard/services" },
    { label: "Priority DM", isCurrentPage: true },
  ],

  "/dashboard/services/webinar": [
    { label: "Services", to: "/dashboard/services" },
    { label: "Webinar", isCurrentPage: true },
  ],

  // Updated dynamic route pattern with serviceType parameter
  "/dashboard/services/:serviceType/edit/:id": [
    { label: "Services", to: "/dashboard/services" },
    {
      label: (params) => formatServiceType(params.serviceType || ""),
      to: (params) => `/dashboard/services/${params.serviceType || ""}`,
    },
    {
      // label: (params) => `Edit Service #${params.id || ''}`, // or just "Edit"
      label: "Edit",
      isCurrentPage: true,
    },
  ],

  // Add more dynamic patterns as needed
  "/dashboard/bookings/:status/:id": [
    {
      label: "Bookings",
      to: (params) => `/dashboard/bookings/${params.status || ""}`,
    },
    {
      label: (params) => `Booking #${params.id || ""}`,
      isCurrentPage: true,
    },
  ],
};

// Function to match current path with patterns
const findMatchingConfig = (
  currentPath: string,
  params: Record<string, string | undefined>
): BreadcrumbConfig[] | undefined => {
  // First, try exact match
  if (breadcrumbConfig[currentPath]) {
    return breadcrumbConfig[currentPath];
  }

  // Then try pattern matching for dynamic routes
  const matchingPattern = Object.keys(breadcrumbConfig).find((pattern) => {
    if (pattern.includes(":")) {
      // Convert pattern to regex
      // Replace :param with regex group that matches the parameter
      const regexPattern = pattern.replace(/:([^/]+)/g, "([^/]+)");
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(currentPath);
    }
    return false;
  });

  return matchingPattern ? breadcrumbConfig[matchingPattern] : undefined;
};

// Function to resolve dynamic values
const resolveBreadcrumbItem = (
  config: BreadcrumbConfig,
  params: Record<string, string | undefined>
) => {
  const resolvedLabel =
    typeof config.label === "function" ? config.label(params) : config.label;
  const resolvedTo =
    typeof config.to === "function" ? config.to(params) : config.to;

  return {
    label: resolvedLabel,
    to: resolvedTo,
    isCurrentPage: config.isCurrentPage,
  };
};

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname;

  // Check if the service type is valid (if present in the URL)
  if (params.serviceType && !isValidServiceType(params.serviceType)) {
    // Service type is invalid, return null or a fallback
    return null;
  }

  // Get breadcrumb configuration for current path
  const breadcrumbConfigs = findMatchingConfig(currentPath, params);

  // If no configuration found, return null or a default breadcrumb
  if (!breadcrumbConfigs) {
    return null;
  }

  // Resolve dynamic breadcrumb items
  const breadcrumbItems = breadcrumbConfigs.map((config) =>
    resolveBreadcrumbItem(config, params)
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem className="hidden md:block">
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.to!}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block ml-3" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;

// Alternative: Hook-based approach for better reusability
export const useBreadcrumbs = (): ResolvedBreadcrumbItem[] => {
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname;

  // Check if the service type is valid (if present in the URL)
  if (params.serviceType && !isValidServiceType(params.serviceType)) {
    // Service type is invalid, return empty array
    return [];
  }

  const breadcrumbConfigs = findMatchingConfig(currentPath, params);

  if (!breadcrumbConfigs) {
    return [];
  }

  return breadcrumbConfigs.map((config) =>
    resolveBreadcrumbItem(config, params)
  );
};

// Usage with the hook:
/*
const SomeComponent = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          // ... breadcrumb rendering logic
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
*/

// Advanced: Auto-fallback breadcrumbs
// export const DynamicBreadcrumbWithFallback = () => {
//   const location = useLocation();
//   const params = useParams();
//   const currentPath = location.pathname;

//   // Check if the service type is valid (if present in the URL)
//   if (params.serviceType && !isValidServiceType(params.serviceType)) {
//     // Service type is invalid, return null or a fallback
//     return null;
//   }

//   // Get breadcrumb configuration for current path
//   let breadcrumbConfigs = findMatchingConfig(currentPath, params);

//   // Fallback: auto-generate from path if no config found
//   if (!breadcrumbConfigs) {
//     const pathSegments = currentPath.split('/').filter(Boolean);
//     breadcrumbConfigs = pathSegments.map((segment, index) => {
//       const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
//       const isLast = index === pathSegments.length - 1;

//       // Format segment name (replace dashes with spaces, capitalize)
//       let label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

//       // If it's a parameter (number-like), try to format it better
//       if (/^\d+$/.test(segment)) {
//         const paramKey = Object.keys(params).find(key => params[key] === segment);
//         if (paramKey === 'id') {
//           label = `#${segment}`;
//         }
//       }

//       return {
//         label,
//         to: isLast ? undefined : path,
//         isCurrentPage: isLast,
//       };
//     });
//   } else {
//     // Resolve dynamic breadcrumb items
//     breadcrumbConfigs = breadcrumbConfigs.map((config) =>
//       resolveBreadcrumbItem(config, params)
//     );
//   }

//   return (
//     <Breadcrumb>
//       <BreadcrumbList>
//         {breadcrumbConfigs.map((item, index) => (
//           <div key={index} className="flex items-center">
//             <BreadcrumbItem className="hidden md:block">
//               {item.isCurrentPage ? (
//                 <BreadcrumbPage>{item.label}</BreadcrumbPage>
//               ) : (
//                 <BreadcrumbLink asChild>
//                   <Link to={item.to!}>{item.label}</Link>
//                 </BreadcrumbLink>
//               )}
//             </BreadcrumbItem>
//             {index < breadcrumbConfigs.length - 1 && (
//               <BreadcrumbSeparator className="hidden md:block ml-3" />
//             )}
//           </div>
//         ))}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// };
