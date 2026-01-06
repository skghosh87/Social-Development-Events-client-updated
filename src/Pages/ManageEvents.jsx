import React, { useEffect, useState } from "react";

import Container from "../Components/Container";
import { FaEdit, FaTrash, FaCalendarCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import UpdateEventModal from "../Components/UpdateEventModal";
import { useAuth } from "../Hooks/useAuth";

const SERVER_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://social-development-events-seven.vercel.app";

const ManageEvents = () => {
  const { user, loading } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchMyEvents = async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${SERVER_BASE_URL}/api/events/organizer/${user.email}`
      );
      setMyEvents(res.data.events || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load your created events.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  // ইভেন্ট ডিলিট
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `${SERVER_BASE_URL}/api/events/${id}?organizerEmail=${user.email}`
          );

          if (res.data.success) {
            toast.success("Event deleted successfully!");

            fetchMyEvents();
          } else {
            toast.error(res.data.message || "Deletion failed.");
          }
        } catch (error) {
          toast.error("Failed to delete the event.");
        }
      }
    });
  };

  // ইভেন্ট আপডেট Modal/Drawer
  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading || isLoading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Loading your events...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="py-20 text-center text-red-600 font-bold">
        Please log in to manage your events.
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-20 text-center text-red-600">
        Error: {error}
      </Container>
    );
  }

  return (
    <Container className="py-10 min-h-[60vh]">
      <h2 className="text-4xl font-extrabold text-center text-green-700 mb-10 flex items-center justify-center gap-3">
        <FaCalendarCheck className="text-green-500" /> Manage My Events
      </h2>

      {myEvents.length === 0 ? (
        <div className="p-10 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
          <p className="text-xl font-medium text-yellow-700">
            You haven't created any events yet!
          </p>
          <Link
            to="/create-event"
            className="mt-4 inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Event Now
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
          <table className="table w-full text-base">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-center">Participants</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {myEvents.map((event) => (
                <tr
                  key={event._id}
                  className="hover:bg-green-50 transition duration-150"
                >
                  <td className="font-semibold text-green-800 max-w-[200px] whitespace-normal">
                    <Link
                      to={`/events/${event._id}`}
                      className="hover:underline"
                    >
                      {event.eventName}
                    </Link>
                  </td>
                  <td>{event.category}</td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="text-center">{event.participants || 0}</td>
                  <td className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleUpdate(event)}
                      className="btn btn-sm btn-info text-white tooltip tooltip-top"
                      data-tip="Edit Event"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn btn-sm btn-error text-white tooltip tooltip-top"
                      data-tip="Delete Event"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal Rendering */}
      {isModalOpen && (
        <UpdateEventModal
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onUpdateSuccess={fetchMyEvents}
          SERVER_BASE_URL={SERVER_BASE_URL}
          userEmail={user.email}
        />
      )}
    </Container>
  );
};

export default ManageEvents;
