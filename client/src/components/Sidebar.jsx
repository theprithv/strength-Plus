import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/new.png";

export default function Sidebar({ onNavigate }) {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-header brand">
        <img src={logo} alt="Strength+ logo" className="brand-logo" />
        <span className="brand-text">
          StrengthPlus
        </span>
      </div>

      <nav
          className="sidebar-nav"
          onClick={(e) => e.target.closest("a") && onNavigate?.()}
        >
        <NavLink to="/profile" className="sidebar-link gap-profile">
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-profile"
          >
            <path
              d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 22C21 18.134 16.9706 15 12 15C7.02944 15 3 18.134 3 22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <span>Profile</span>
        </NavLink>

        <NavLink to="/workouts" className="sidebar-link gap-workouts">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-workouts"
          >
            {/* right weight */}
            <path
              d="M15.5 9V15
         C15.5 15.465 15.5 15.6975 15.5511 15.8882
         C15.6898 16.4059 16.0941 16.8102 16.6118 16.9489
         C16.8025 17 17.035 17 17.5 17
         C17.965 17 18.1975 17 18.3882 16.9489
         C18.9059 16.8102 19.3102 16.4059 19.4489 15.8882
         C19.5 15.6975 19.5 15.465 19.5 15V9
         C19.5 8.53501 19.5 8.30252 19.4489 8.11177
         C19.3102 7.59413 18.9059 7.18981 18.3882 7.05111
         C18.1975 7 17.965 7 17.5 7
         C17.035 7 16.8025 7 16.6118 7.05111
         C16.0941 7.18981 15.6898 7.59413 15.5511 8.11177
         C15.5 8.30252 15.5 8.53501 15.5 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            {/* left weight */}
            <path
              d="M4.5 9V15
         C4.5 15.465 4.5 15.6975 4.55111 15.8882
         C4.68981 16.4059 5.09413 16.8102 5.61177 16.9489
         C5.80252 17 6.03501 17 6.5 17
         C6.96499 17 7.19748 17 7.38823 16.9489
         C7.90587 16.8102 8.31019 16.4059 8.44889 15.8882
         C8.5 15.6975 8.5 15.465 8.5 15V9
         C8.5 8.53501 8.5 8.30252 8.44889 8.11177
         C8.31019 7.59413 7.90587 7.18981 7.38823 7.05111
         C7.19748 7 6.96499 7 6.5 7
         C6.03501 7 5.80252 7 5.61177 7.05111
         C5.09413 7.18981 4.68981 7.59413 4.55111 8.11177
         C4.5 8.30252 4.5 8.53501 4.5 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            {/* bar */}
            <path
              d="M5 10H4
         C2.89543 10 2 10.8954 2 12
         C2 13.1046 2.89543 14 4 14H5
         M9 12H15
         M19 14H20
         C21.1046 14 22 13.1046 22 12
         C22 10.8954 21.1046 10 20 10H19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <span>Workouts</span>
        </NavLink>

        <NavLink to="/routines" className="sidebar-link gap-routines">
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-routines"
          >
            <path
              d="M7.998 4h-1a3 3 0 00-3 3v11a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3h-1"
              stroke="currentColor"
              strokeWidth="1.75"
            />
            <path
              d="M16.002 15h-8m8-4h-8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="8.002"
              y="2"
              width="8"
              height="4"
              rx="0.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <span>Routines</span>
        </NavLink>

        <NavLink to="/exercises" className="sidebar-link gap-exercises">
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-exercises"
          >
            <path
              d="M3.43125 14.704L14.2387 16.055C14.8568 16.1322 15.3208 16.6578 15.3208 17.2805C15.3208 18.0233 14.6694 18.5985 13.9325 18.5063L3.12502 17.1554C2.50697 17.0782 2.04297 16.5526 2.04297 15.9299C2.04297 15.187 2.69401 14.6119 3.43125 14.704Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.70312 17.2275V21.9992"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.6602 18.4727V21.9995"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.15625 12.7135C2.15625 11.5676 3.08519 10.6387 4.23105 10.6387C5.3769 10.6387 6.30584 11.5676 6.30584 12.7135C6.30584 13.8593 5.3769 14.7883 4.23105 14.7883C3.08519 14.7883 2.15625 13.8593 2.15625 12.7135Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5858 9.25226V13.2867L18.1186 13.1958C19.3644 13.3514 20.2995 14.4108 20.2995 15.6662V20.7556C20.2995 21.4431 19.7422 22.0004 19.0547 22.0004C18.3673 22.0004 17.8099 21.4431 17.8099 20.7556V16.5024L7.64535 15.2317C6.81475 15.1278 6.19141 14.422 6.19141 13.5848C6.19141 12.5865 7.0662 11.8141 8.05707 11.938L9.09618 12.0677V9.25195"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.60547 5.73445C6.60547 3.6721 8.27757 2 10.3399 2C12.4023 2 14.0744 3.6721 14.0744 5.73445C14.0744 7.7968 12.4023 9.46889 10.3399 9.46889C8.27757 9.46889 6.60547 7.7968 6.60547 5.73445Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.09766 5.73407C9.09766 5.04662 9.65502 4.48926 10.3425 4.48926C11.0299 4.48926 11.5873 5.04662 11.5873 5.73407C11.5873 6.42152 11.0299 6.97889 10.3425 6.97889C9.65502 6.97889 9.09766 6.42152 9.09766 5.73407Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 22H22.0001"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Exercises</span>
        </NavLink>

        <NavLink to="/dashboard" className="sidebar-link gap-dashboard">
          <svg
            width="29"
            height="29"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-dashboard"
          >
            {/* top-left */}
            <path
              d="M9.918 10.0005H7.082
         C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509
         C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455
         C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918
         C10.3341 19.004 10.7346 18.842 11.0313 18.5502
         C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565
         C11.4966 11.1404 11.328 10.7427 11.0313 10.4509
         C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* top-right */}
            <path
              d="M9.918 4.0006H7.082
         C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076
         C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918
         C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936
         C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* bottom-left */}
            <path
              d="M15.082 13.0007H17.917
         C18.3333 13.0044 18.734 12.8425 19.0309 12.5507
         C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666
         C19.4966 5.14054 19.328 4.74282 19.0313 4.45101
         C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082
         C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101
         C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447
         C13.5034 11.8608 13.672 12.2585 13.9687 12.5503
         C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* bottom-right */}
            <path
              d="M15.082 19.0006H17.917
         C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936
         C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082
         C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066
         C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/history" className="sidebar-link gap-history">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-history"
          >
            {/* clock hands */}
            <path
              d="M12 8V12L14.5 14.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* circular history arrow */}
            <path
              d="M3.75 12C3.75 7.44365 7.44365 3.75 12 3.75
         C16.5563 3.75 20.25 7.44365 20.25 12
         C20.25 16.5563 16.5563 20.25 12 20.25
         C9.9 20.25 8.0 19.55 6.5 18.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* arrow head */}
            <path
              d="M6.5 18.4L6.6 15.8M6.5 18.4L9 18.3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>History</span>
        </NavLink>

      </nav>

      <div className="sidebar-footer">
        <button onClick={() => { logout(); onNavigate?.(); }} className="logout-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon icon-logout"
          >
            <path
              d="M16.5 17L21.5 12M21.5 12L16.5 7M21.5 12H9.5M9.5 3H8.3C6.61984 3 5.77976 3 5.13803 3.32698C4.57354 3.6146 4.1146 4.07354 3.82698 4.63803C3.5 5.27976 3.5 6.11984 3.5 7.8V16.2C3.5 17.8802 3.5 18.7202 3.82698 19.362C4.1146 19.9265 4.57354 20.3854 5.13803 20.673C5.77976 21 6.61984 21 8.3 21H9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
