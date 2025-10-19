import { createContext, useState } from "react";
import { PropertyMaster } from "../Models/models";

interface PropertyContextType {
    property: PropertyMaster | null,
    setProperty: (property: PropertyMaster | null) => void
}
export const PropertyContext = createContext<PropertyContextType>({
    property: null,
    setProperty: () => {}
});

export const PropertyProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [property, setProperty] = useState<PropertyMaster | null>(null)
    return (
        <PropertyContext.Provider value={{ property, setProperty}}>
            {children}
        </PropertyContext.Provider>
    );
}


