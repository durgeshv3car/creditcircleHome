import React, { useState } from "react";

function PartnerStatus({
  close,
  userdata,
  id,
  phoneNumber,
}: {
  close: any;
  userdata:any;
  id: string;
  phoneNumber: number;
}) {
  const [companies, setCompanies] = useState([
    { id: 1, name: "Cashe", status: "" },
    { id: 2, name: "Money Control", status: "" },
  ]);

  




  const handleClose = () => {
    close();
  };

  console.log(userdata)


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Error":
        return "bg-red-100 text-red-800 border-red-200";
      case "Not Registered":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return "✓";
      case "Pending":
        return "⏳";
      case "NOT YET REGISTERED":
        return "⚠";
      default:
        return "✗";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white relative">
          <h1 className="text-xl font-semibold">Partner Status Overview</h1>
          <p className="text-blue-100 text-sm mt-1">
            Manage and monitor partner registrations
          </p>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white text-lg font-bold transition-all duration-200"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {companies.map((company) => {
              const showNotificationButton =
                company.status === "NOT YET REGISTERED" ||
                company.status === "Rejected" ||
                company.status === "Pending";


              return (
                <div
                  key={company.id}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                >
                  <div className="flex flex-col">
                    {/* Top section with company info and notification button */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {company.name}
                          </h2>
                          {company.status && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-lg">
                                {getStatusIcon(company.status)}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  company.status
                                )}`}
                              >
                                {company.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                
                    </div>

                    {/* Bottom section with Check Status button aligned to the right */}
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
                      >
                        Check Status
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{companies.length} total partners</span>
            <span>
              {companies.filter((c) => c.status === "Approved").length} approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerStatus;
