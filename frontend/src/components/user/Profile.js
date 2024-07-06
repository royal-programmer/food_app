import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-5 profile">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <figure className="avatar avatar-profile text-center mr-3">
                  <img
                    className="rounded-circle figure-img img-fluid"
                    src={user && user.avatar ? user.avatar.url : '/images/avatarPreview.jpg'}
                    alt={user.name}
                  />
                </figure>
              </div>
              <span>Welcome {user.name}!</span>
              <Link
                to="/users/me/update"
                id="edit_profile"
                className="btn btn-primary btn-block my-3"
              >
                Edit Profile
              </Link>
              <h4>Full Name:</h4>
              <p>{user.email}</p>
              <h4>Joined On</h4>
              <p>{String(user.createdAt).substring(0, 10)}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
