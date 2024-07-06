// import React, { Fragment } from "react";
// import { Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ isAdmin, element: Element, ...rest }) => {
//   const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           element={
//             isAuthenticated === false ? (
//               <Navigate to="/users/login" replace />
//             ) : isAdmin === true && user.role !== "admin" ? (
//               <Navigate to="/" replace />
//             ) : (
//               <Element />
//             )
//           }
//         />
//       )}
//     </Fragment>
//   );
// };

// export default ProtectedRoute;

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/user/login" />;
  }

  return element;
};

export default ProtectedRoute;
