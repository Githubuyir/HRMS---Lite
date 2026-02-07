import './Sidebar.css';

function Sidebar({ activeSection, onSectionChange }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'employees', label: 'Employees', icon: '👥' },
        { id: 'attendance', label: 'Attendance', icon: '📅' }
    ];

    return (
        <aside className="sidebar">
            <ul className="sidebar-nav">
                {menuItems.map((item) => (
                    <li key={item.id} className="sidebar-item">
                        <a
                            className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => onSectionChange(item.id)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
