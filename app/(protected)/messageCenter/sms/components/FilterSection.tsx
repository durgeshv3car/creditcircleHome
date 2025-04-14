// FilterSection.jsx
import { useState } from 'react';
import { 
  ChevronRight, 
  Buildings, 
  MapPin, 
  Briefcase, 
  Users, 
  DollarSign, 
  Coins, 
  CalendarDays, 
  FileEdit, 
  Tag, 
  Database,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FilterSection = () => {
  const [activeFilters, setActiveFilters] = useState({
    location: ['Berlin', 'France'],
    revenue: ['1mil'],
    yearFounded: ['2024', '2023']
  });
  
  const [expandedPanel, setExpandedPanel] = useState(null);
  
  const handlePanelClick = (panel) => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };
  
  const removeFilter = (category, value) => {
    setActiveFilters({
      ...activeFilters,
      [category]: activeFilters[category].filter(item => item !== value)
    });
  };
  
  const filterCategories = [
    { id: 'companyName', label: 'Company name',  },
    { id: 'location', label: 'Location', },
    { id: 'industry', label: 'Industry',  },
    { id: 'employeeHeadcount', label: 'Employee headcount',  },
    { id: 'revenue', label: 'Revenue',   },
    { id: 'funding', label: 'Funding',  },
    { id: 'yearFounded', label: 'Year founded', },
    { id: 'jobChanges', label: 'Job changes',  },
    { id: 'jobTitle', label: 'Job title', },
    { id: 'crmProperties', label: 'CRM properties', },
  ];
  
  const renderFilterTags = (categoryId) => {
    if (!activeFilters[categoryId] || activeFilters[categoryId].length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {activeFilters[categoryId].map(filter => (
          <Badge key={filter} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-1">
            {filter}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={() => removeFilter(categoryId, filter)} 
            />
          </Badge>
        ))}
      </div>
    );
  };

  // Count total active filters
  const totalActiveFilters = Object.values(activeFilters).reduce(
    (count, filters) => count + filters.length, 0
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <div className="relative w-full">
          <Button 
            variant="outline" 
            className="w-full justify-start text-gray-500 bg-white border-gray-200"
          >
            SQL
          </Button>
        </div>
        <div className="relative w-full">
          <Button 
            variant="outline" 
            className="w-full justify-start text-purple-600 bg-white border-purple-200"
          >
            <span className="mr-2">Filters</span>
            {totalActiveFilters > 0 && (
              <Badge className="bg-purple-600 text-white ml-auto">
                {totalActiveFilters}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <div className="flex items-center">
              <span className="text-purple-600">{totalActiveFilters} filters</span>
              {totalActiveFilters > 0 && (
                <Button variant="ghost" className="text-purple-600 ml-1">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {filterCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-md">
                <button
                  className="w-full flex items-center justify-between p-3 text-left"
                  onClick={() => handlePanelClick(category.id)}
                >
                  <div className="flex items-center space-x-2">
                    
                    <span>{category.label}</span>
                  </div>
                  {renderFilterTags(category.id)}
                 
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Location</h2>
          <p className="text-gray-500 mb-4">Filter location by city, state, country or continent</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.location.map(location => (
              <Badge key={location} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-1">
                {location}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('location', location)} 
                />
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="contact">
            <TabsList className="mb-6">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                 Contact
              </TabsTrigger>
              <TabsTrigger value="companyHQ" className="flex items-center gap-2">
               Hq
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact">
              <Input 
                placeholder="E.g. Berlin, France, Asia" 
                className="mb-6"
              />
            </TabsContent>
            
            <TabsContent value="companyHQ">
              <div className="mb-4">
                <h3 className="mb-2 text-sm">Company HQ</h3>
                <Input 
                  placeholder="E.g. Paris, Canada, APAC" 
                  className="mb-4"
                />
              </div>
              
              <div className="mb-4">
                <h3 className="mb-2 text-sm">Company HQ country</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="mb-2 text-sm">ZIP</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="startsWith">Starts with</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="mb-2 text-sm">Radius</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Miles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Button className="bg-transparent hover:bg-gray-100 text-gray-600 border border-gray-200">
            Apply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSection;