$(document).ready(function() {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    
    console.log('Page loaded. Admin logged in:', isAdmin);
    
    if (isAdmin) {
        showAdminPanel();
        // Force load dashboard data after 1 second
        setTimeout(function() {
            console.log('Force loading dashboard data...');
            loadDashboard();
            loadBookings();
            loadCustomers();
            loadServices();
            loadStaff();
        }, 1000);
    } else {
        showPublicPortal();
    }
    
    // Load public portal data
    loadPublicServices();
    loadPublicStaff();
    loadPublicActivity(); // ← Load recent activity
    
    // Status check form
    $('#statusCheckForm').submit(function(e) {
        e.preventDefault();
        checkBookingStatus();
    });
    
    // Navigation
    $('.nav-link').click(function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        
        $('.page').removeClass('active');
        $(`#${page}`).addClass('active');
        
        loadPageData(page);
    });
    
    // Mobile toggle
    $('#mobileToggle').click(function() {
        $('#navMenu').toggleClass('active');
    });
    
    // Modal
    $('.close').click(function() {
        $('#modal').fadeOut();
    });
    
    $(window).click(function(e) {
        if ($(e.target).is('#modal')) {
            $('#modal').fadeOut();
        }
    });
    
    // Public Booking Form
    $('#publicBookingForm').submit(function(e) {
        e.preventDefault();
        submitPublicBooking($(this).serialize());
    });
    
    // Login Form
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        adminLogin();
    });
    
    // Date change - load available times
    $('#publicBookingDate, #publicServiceSelect, #publicStaffSelect').change(function() {
        loadAvailableTimeSlots();
    });
    
    // Admin actions
    $('#addBookingBtn').click(function() {
        showBookingModal();
    });
    
    $('#addCustomerBtn').click(function() {
        showCustomerModal();
    });
    
    $('#addServiceBtn').click(function() {
        showServiceModal();
    });
    
    $('#addStaffBtn').click(function() {
        showStaffModal();
    });
    
    // Search and Filter
    $('#searchBooking').on('keyup', function() {
        loadBookings();
    });
    
    $('#filterStatus, #filterDate').change(function() {
        loadBookings();
    });
    
    $('#searchCustomer').on('keyup', function() {
        loadCustomers();
    });
    
    // Set minimum date for booking
    const today = new Date().toISOString().split('T')[0];
    $('#publicBookingDate, #filterDate').attr('min', today);
});

function showPublicPortal() {
    $('#publicBooking').show();
    $('#adminPanel').hide();
}

function showAdminPanel() {
    $('#publicBooking').hide();
    $('#adminPanel').show();
    
    // Load all data
    console.log('Loading admin panel data...');
    loadDashboard();
    loadBookings();
    loadCustomers();
    loadServices();
    loadStaff();
}

function showAdminLogin() {
    $('#loginModal').fadeIn();
}

function closeLoginModal() {
    $('#loginModal').fadeOut();
}

function adminLogin() {
    const username = $('input[name="username"]').val();
    const password = $('input[name="password"]').val();
    
    // Simple authentication (in production, use proper backend authentication)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        $('#loginModal').fadeOut();
        showAdminPanel();
    } else {
        alert('Invalid credentials! Try: admin / admin123');
    }
}

function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    showPublicPortal();
}

function scrollToBooking() {
    document.getElementById('bookingSection').scrollIntoView({ behavior: 'smooth' });
}

// Load public services
function loadPublicServices() {
    $.ajax({
        url: 'api/services.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let showcaseHtml = '';
            let selectHtml = '<option value="">Select a service</option>';
            
            data.forEach(service => {
                showcaseHtml += `
                    <div class="service-showcase-card">
                        <div class="service-showcase-icon">
                            <i class="fas fa-${service.icon || 'cut'}"></i>
                        </div>
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                        <div class="service-showcase-price">$${service.price}</div>
                        <p style="color: var(--gray);"><i class="fas fa-clock"></i> ${service.duration} minutes</p>
                    </div>
                `;
                
                selectHtml += `<option value="${service.id}">${service.name} - $${service.price} (${service.duration} min)</option>`;
            });
            
            $('#publicServicesGrid').html(showcaseHtml);
            $('#publicServiceSelect').html(selectHtml);
        }
    });
}

// Load public staff
function loadPublicStaff() {
    $.ajax({
        url: 'api/staff.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let showcaseHtml = '';
            let selectHtml = '<option value="">Select staff member</option>';
            
            data.forEach(staff => {
                const initials = staff.name.split(' ').map(n => n[0]).join('');
                showcaseHtml += `
                    <div class="staff-showcase-card">
                        <div class="staff-showcase-avatar">${initials}</div>
                        <h3>${staff.name}</h3>
                        <p style="color: var(--primary); font-weight: 600;">${staff.position}</p>
                        <p><i class="fas fa-phone"></i> ${staff.phone}</p>
                    </div>
                `;
                
                selectHtml += `<option value="${staff.id}">${staff.name} - ${staff.position}</option>`;
            });
            
            $('#publicStaffGrid').html(showcaseHtml);
            $('#publicStaffSelect').html(selectHtml);
        }
    });
}

// Load available time slots
function loadAvailableTimeSlots() {
    const date = $('#publicBookingDate').val();
    const serviceId = $('#publicServiceSelect').val();
    const staffId = $('#publicStaffSelect').val();
    
    if (!date || !serviceId || !staffId) {
        $('#timeSlots').html('<p>Please select date, service, and staff first</p>');
        return;
    }
    
    $.ajax({
        url: 'api/available_slots.php',
        method: 'GET',
        data: { date: date, service_id: serviceId, staff_id: staffId },
        dataType: 'json',
        success: function(data) {
            let html = '';
            
            if (data.length > 0) {
                data.forEach(slot => {
                    const disabled = slot.available ? '' : 'disabled';
                    html += `
                        <div class="time-slot ${disabled}" onclick="selectTimeSlot('${slot.time}', this)">
                            ${slot.time}
                        </div>
                    `;
                });
            } else {
                html = '<p>No available time slots for this date</p>';
            }
            
            $('#timeSlots').html(html);
        }
    });
}

function selectTimeSlot(time, element) {
    if ($(element).hasClass('disabled')) return;
    
    $('.time-slot').removeClass('selected');
    $(element).addClass('selected');
    $('#selectedTime').val(time);
}

// Submit public booking
function submitPublicBooking(formData) {
    const timeSelected = $('#selectedTime').val();
    
    if (!timeSelected) {
        alert('Please select a time slot');
        return;
    }
    
    $.ajax({
        url: 'api/public_booking.php',
        method: 'POST',
        data: formData,
        success: function(response) {
            alert('Booking submitted successfully! We will contact you shortly to confirm.');
            $('#publicBookingForm')[0].reset();
            $('#timeSlots').html('');
            $('#selectedTime').val('');
            $('.time-slot').removeClass('selected');
        },
        error: function() {
            alert('Error submitting booking. Please try again.');
        }
    });
}

function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'services':
            loadServices();
            break;
        case 'staff':
            loadStaff();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// --- START OF LOAD DASHBOARD FUNCTION ---
function loadDashboard() {
    console.log('Loading dashboard...');
    
    $.ajax({
        url: 'api/dashboard.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Dashboard data loaded:', data);
            
            $('#todayBookings').text(data.todayBookings || 0);
            $('#totalCustomers').text(data.totalCustomers || 0);
            $('#monthlyRevenue').text('$' + (data.monthlyRevenue || 0));
            $('#pendingBookings').text(data.pendingBookings || 0);
            
            // Today's schedule (CONFIRMED & COMPLETED ONLY)
            let scheduleHtml = '';
            if (data.todaySchedule && data.todaySchedule.length > 0) {
                console.log('Today schedule items:', data.todaySchedule.length);
                data.todaySchedule.forEach(item => {
                    const statusColor = item.status === 'confirmed' ? '#4facfe' : '#43e97b';
                    const statusBg = item.status === 'confirmed' ? '#dbeafe' : '#d1fae5';
                    const statusText = item.status === 'confirmed' ? '#1e40af' : '#065f46';
                    
                    scheduleHtml += `
                        <div class="schedule-item" style="border-left-color: ${statusColor};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="font-size: 1.1rem; color: var(--dark);">
                                    <i class="fas fa-clock" style="color: ${statusColor};"></i> 
                                    ${item.booking_time}
                                </strong>
                                <span style="background: ${statusBg}; color: ${statusText}; padding: 0.3rem 0.7rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600;">
                                    ${item.status}
                                </span>
                            </div>
                            <div style="color: var(--dark); margin-bottom: 0.3rem; font-weight: 500;">
                                <i class="fas fa-user" style="color: ${statusColor}; width: 20px;"></i> 
                                ${item.customer_name}
                            </div>
                            <div style="color: var(--gray); font-size: 0.9rem;">
                                <i class="fas fa-scissors" style="color: ${statusColor}; width: 20px;"></i> 
                                ${item.service_name}
                            </div>
                            <div style="color: var(--gray); font-size: 0.9rem;">
                                <i class="fas fa-user-tie" style="color: ${statusColor}; width: 20px;"></i> 
                                ${item.staff_name}
                            </div>
                        </div>
                    `;
                });
            } else {
                console.log('No confirmed bookings for today');
                scheduleHtml = `
                    <div style="text-align: center; padding: 3rem 1rem; color: var(--gray);">
                        <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                        <p style="font-size: 1rem;">No confirmed bookings for today</p>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Check the Bookings page to accept pending appointments</p>
                    </div>
                `;
            }
            $('#todaySchedule').html(scheduleHtml);
            
            // Recent activity
            let activityHtml = '';
            if (data.recentActivity && data.recentActivity.length > 0) {
                data.recentActivity.forEach(activity => {
                    activityHtml += `
                        <div class="activity-item">
                            <i class="fas fa-${activity.icon}"></i> 
                            <span style="color: var(--dark);">${activity.message}</span><br>
                            <small style="color: var(--gray);">${activity.time}</small>
                        </div>
                    `;
                });
            } else {
                activityHtml = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No recent activity</p>';
            }
            $('#recentActivity').html(activityHtml);
        },
        error: function(xhr, status, error) {
            console.error('Error loading dashboard:', error);
            console.error('Response:', xhr.responseText);
            $('#todaySchedule').html(`
                <div style="text-align: center; padding: 2rem; color: red;">
                    <i class="fas fa-exclamation-triangle"></i><br>
                    Error loading dashboard data<br>
                    <button class="btn btn-sm btn-primary" onclick="loadDashboard()" style="margin-top: 1rem;">Retry</button>
                </div>
            `);
        }
    });
}
// --- END OF LOAD DASHBOARD FUNCTION ---


function loadBookings() {
    const search = $('#searchBooking').val();
    const status = $('#filterStatus').val();
    const date = $('#filterDate').val();
    
    $.ajax({
        url: 'api/bookings.php',
        method: 'GET',
        data: { search: search, status: status, date: date },
        dataType: 'json',
        success: function(data) {
            console.log('Bookings loaded:', data);
            let html = '';
            
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(booking => {
                    html += `
                        <tr>
                            <td>#${booking.id}</td>
                            <td>${booking.customer_name}</td>
                            <td>${booking.service_name}</td>
                            <td>${booking.staff_name}</td>
                            <td>${booking.booking_date}</td>
                            <td>${booking.booking_time}</td>
                            <td><span class="badge badge-${booking.status}">${booking.status}</span></td>
                            <td>${booking.price}</td>
                            <td>
                                ${booking.status === 'pending' ? `
                                    <button class="btn btn-sm btn-success" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                                        <i class="fas fa-check"></i> Accept
                                    </button>
                                ` : ''}
                                ${booking.status === 'confirmed' ? `
                                    <button class="btn btn-sm btn-primary" onclick="updateBookingStatus(${booking.id}, 'completed')">
                                        <i class="fas fa-check-double"></i> Complete
                                    </button>
                                ` : ''}
                                ${booking.status === 'pending' || booking.status === 'confirmed' ? `
                                    <button class="btn btn-sm btn-warning" onclick="updateBookingStatus(${booking.id}, 'cancelled')">
                                        <i class="fas fa-times"></i> Reject
                                    </button>
                                ` : ''}
                                <button class="btn btn-sm btn-danger" onclick="deleteBooking(${booking.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                html = '<tr><td colspan="9" style="text-align:center;">No bookings found</td></tr>';
            }
            $('#bookingsTable tbody').html(html);
        },
        error: function(xhr, status, error) {
            console.error('Error loading bookings:', error);
            console.error('Response:', xhr.responseText);
            $('#bookingsTable tbody').html('<tr><td colspan="9" style="text-align:center; color:red;">Error loading bookings. Check console for details.</td></tr>');
        }
    });
}

function loadCustomers() {
    const search = $('#searchCustomer').val();
    
    $.ajax({
        url: 'api/customers.php',
        method: 'GET',
        data: { search: search },
        dataType: 'json',
        success: function(data) {
            let html = '';
            if (data.length > 0) {
                data.forEach(customer => {
                    html += `
                        <tr>
                            <td>#${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.total_visits || 0}</td>
                            <td>${customer.last_visit || 'Never'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewCustomer(${customer.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                html = '<tr><td colspan="7" style="text-align:center;">No customers found</td></tr>';
            }
            $('#customersTable tbody').html(html);
        }
    });
}

function loadServices() {
    $.ajax({
        url: 'api/services.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let html = '';
            if (data.length > 0) {
                data.forEach(service => {
                    html += `
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-${service.icon || 'cut'}"></i>
                            </div>
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                            <div class="service-price">$${service.price}</div>
                            <p><i class="fas fa-clock"></i> ${service.duration} minutes</p>
                            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                                <button class="btn btn-sm btn-primary" onclick="editService(${service.id})" style="flex:1">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})" style="flex:1">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = '<p>No services available</p>';
            }
            $('#servicesGrid').html(html);
        }
    });
}

function loadStaff() {
    $.ajax({
        url: 'api/staff.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let html = '';
            if (data.length > 0) {
                data.forEach(staff => {
                    const initials = staff.name.split(' ').map(n => n[0]).join('');
                    html += `
                        <div class="staff-card">
                            <div class="staff-avatar">${initials}</div>
                            <h3>${staff.name}</h3>
                            <p>${staff.position}</p>
                            <p><i class="fas fa-phone"></i> ${staff.phone}</p>
                            <p><i class="fas fa-envelope"></i> ${staff.email}</p>
                            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                                <button class="btn btn-sm btn-primary" onclick="editStaff(${staff.id})" style="flex:1">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteStaff(${staff.id})" style="flex:1">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = '<p>No staff members found</p>';
            }
            $('#staffGrid').html(html);
        }
    });
}

function loadReports() {
    // Placeholder for reports functionality
    generateReport();
}

function generateReport() {
    const type = $('#reportType').val();
    const startDate = $('#reportStartDate').val();
    const endDate = $('#reportEndDate').val();
    
    $.ajax({
        url: 'api/reports.php',
        method: 'GET',
        data: { type: type, start_date: startDate, end_date: endDate },
        dataType: 'json',
        success: function(data) {
            $('#reportRevenue').text('$' + (data.revenue || 0));
            $('#reportBookings').text(data.bookings || 0);
            $('#reportNewCustomers').text(data.newCustomers || 0);
            $('#reportCancellation').text((data.cancellationRate || 0) + '%');
        }
    });
}

function exportBookings() {
    window.location.href = 'api/export_bookings.php';
}

// Modal functions
function showBookingModal(id = null) {
    $('#modalTitle').text(id ? 'Edit Booking' : 'New Booking');
    
    $.when(
        $.ajax({ url: 'api/customers.php', method: 'GET' }),
        $.ajax({ url: 'api/services.php', method: 'GET' }),
        $.ajax({ url: 'api/staff.php', method: 'GET' })
    ).done(function(customersRes, servicesRes, staffRes) {
        const customers = customersRes[0];
        const services = servicesRes[0];
        const staff = staffRes[0];
        
        let html = `
            <form id="bookingForm">
                <div class="form-group">
                    <label>Customer</label>
                    <select name="customer_id" required>
                        <option value="">Select Customer</option>
                        ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Service</label>
                    <select name="service_id" required>
                        <option value="">Select Service</option>
                        ${services.map(s => `<option value="${s.id}">${s.name} - ${s.price}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Staff</label>
                    <select name="staff_id" required>
                        <option value="">Select Staff</option>
                        ${staff.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" name="booking_date" min="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <input type="time" name="booking_time" required>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Rejected/Cancelled</option> </select>
                </div>
                <button type="submit" class="btn btn-primary">Save Booking</button>
            </form>
        `;
        
        $('#modalBody').html(html);
        $('#modal').fadeIn();
        
        setTimeout(function() {
            $('#bookingForm').off('submit').on('submit', function(e) {
                e.preventDefault();
                saveBooking($(this).serialize());
            });
        }, 100);
    }).fail(function() {
        alert('Error loading form data. Please check your database connection.');
    });
}

function showCustomerModal(id = null) {
    $('#modalTitle').text(id ? 'Edit Customer' : 'Add Customer');
    
    let html = `
        <form id="customerForm">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required placeholder="Enter customer name">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="customer@example.com">
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" required placeholder="555-0123">
            </div>
            <button type="submit" class="btn btn-primary">Save Customer</button>
        </form>
    `;
    
    $('#modalBody').html(html);
    $('#modal').fadeIn();
    
    setTimeout(function() {
        $('#customerForm').off('submit').on('submit', function(e) {
            e.preventDefault();
            saveCustomer($(this).serialize());
        });
    }, 100);
}

function showServiceModal(id = null) {
    $('#modalTitle').text(id ? 'Edit Service' : 'Add Service');
    
    let html = `
        <form id="serviceForm">
            <div class="form-group">
                <label>Service Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Price ($)</label>
                <input type="number" name="price" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label>Duration (minutes)</label>
                <input type="number" name="duration" min="5" step="5" required>
            </div>
            <div class="form-group">
                <label>Icon</label>
                <select name="icon">
                    <option value="cut">Scissors</option>
                    <option value="spray-can">Spray</option>
                    <option value="spa">Spa</option>
                    <option value="paint-brush">Brush</option>
                    <option value="hand-sparkles">Hand Sparkles</option>
                    <option value="face-smile">Face Smile</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Service</button>
        </form>
    `;
    
    $('#modalBody').html(html);
    $('#modal').fadeIn();
    
    // Attach submit handler after modal is shown
    setTimeout(function() {
        $('#serviceForm').off('submit').on('submit', function(e) {
            e.preventDefault();
            console.log('Service form submitted');
            const formData = $(this).serialize();
            console.log('Form data:', formData);
            saveService(formData);
        });
    }, 100);
}

function showStaffModal(id = null) {
    $('#modalTitle').text(id ? 'Edit Staff' : 'Add Staff');
    
    let html = `
        <form id="staffForm">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required placeholder="Enter staff name">
            </div>
            <div class="form-group">
                <label>Position</label>
                <input type="text" name="position" required placeholder="e.g. Senior Stylist">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="staff@salon.com">
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" required placeholder="555-0123">
            </div>
            <button type="submit" class="btn btn-primary">Save Staff</button>
        </form>
    `;
    
    $('#modalBody').html(html);
    $('#modal').fadeIn();
    
    setTimeout(function() {
        $('#staffForm').off('submit').on('submit', function(e) {
            e.preventDefault();
            saveStaff($(this).serialize());
        });
    }, 100);
}

function saveBooking(data) {
    $.ajax({
        url: 'api/bookings.php',
        method: 'POST',
        data: data,
        success: function() {
            $('#modal').fadeOut();
            loadBookings();
            loadDashboard();
            alert('Booking saved successfully!');
        }
    });
}

function saveCustomer(data) {
    $.ajax({
        url: 'api/customers.php',
        method: 'POST',
        data: data,
        success: function() {
            $('#modal').fadeOut();
            loadCustomers();
            alert('Customer saved successfully!');
        }
    });
}

function saveService(data) {
    console.log('Saving service with data:', data);
    
    $.ajax({
        url: 'api/services.php',
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function(response) {
            console.log('Service saved successfully:', response);
            $('#modal').fadeOut();
            loadServices();
            loadPublicServices();
            alert('Service saved successfully!');
        },
        error: function(xhr, status, error) {
            console.error('Error saving service:', error);
            console.error('Response:', xhr.responseText);
            alert('Error saving service: ' + error + '\nPlease check if the database is properly configured.');
        }
    });
}

function saveStaff(data) {
    $.ajax({
        url: 'api/staff.php',
        method: 'POST',
        data: data,
        success: function() {
            $('#modal').fadeOut();
            loadStaff();
            loadPublicStaff();
            alert('Staff saved successfully!');
        }
    });
}

function updateBookingStatus(id, status) {
    console.log('Updating booking status:', id, status);
    
    // Naya confirmation logic
    let confirmationMessage = `Are you sure you want to mark booking #${id} as ${status}?`;

    if (status === 'cancelled') {
        confirmationMessage = `Are you sure you want to REJECT/CANCEL booking #${id}?`;
    }

    if (!confirm(confirmationMessage)) {
        return; // Agar user "No" press karta hai toh function se bahar nikal jaye
    }

    $.ajax({
        url: 'api/bookings.php',
        method: 'PUT',
        data: JSON.stringify({ id: id, status: status }),
        contentType: 'application/json',
        success: function() {
            console.log('Booking status updated successfully');
            loadBookings();
            loadDashboard(); // ← Refresh dashboard to show changes
            
            // Show success message
            alert(`Booking #${id} marked as ${status}!`);
        },
        error: function(xhr, status, error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking status. Please try again.');
        }
    });
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        $.ajax({
            url: 'api/bookings.php?id=' + id,
            method: 'DELETE',
            success: function() {
                loadBookings();
                loadDashboard();
            }
        });
    }
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        $.ajax({
            url: 'api/customers.php?id=' + id,
            method: 'DELETE',
            success: function() {
                loadCustomers();
            }
        });
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        $.ajax({
            url: 'api/services.php?id=' + id,
            method: 'DELETE',
            success: function() {
                loadServices();
                loadPublicServices();
            }
        });
    }
}

function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        $.ajax({
            url: 'api/staff.php?id=' + id,
            method: 'DELETE',
            success: function() {
                loadStaff();
                loadPublicStaff();
            }
        });
    }
}

function viewCustomer(id) {
    // View customer details - to be implemented
    alert('View customer details - Feature to be implemented');
}

function editService(id) {
    showServiceModal(id);
}

function editStaff(id) {
    showStaffModal(id);
}

// Check booking status (PUBLIC)
function checkBookingStatus() {
    const email = $('#checkEmail').val();
    const phone = $('#checkPhone').val();
    
    if (!email && !phone) {
        alert('Please enter either email or phone number');
        return;
    }
    
    $.ajax({
        url: 'api/check_status.php',
        method: 'GET',
        data: { email: email, phone: phone },
        dataType: 'json',
        success: function(data) {
            displayBookingStatus(data);
        },
        error: function() {
            $('#statusResult').html(`
                <div style="text-align: center; padding: 2rem; color: var(--danger);">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No Bookings Found</h3>
                    <p>We couldn't find any bookings with this information.</p>
                </div>
            `).fadeIn();
        }
    });
}

function displayBookingStatus(bookings) {
    if (!bookings || bookings.length === 0) {
        $('#statusResult').html(`
            <div style="text-align: center; padding: 2rem; color: var(--gray);">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>No Bookings Found</h3>
                <p>You don't have any appointments yet. Book one now!</p>
                <button class="btn btn-primary" onclick="scrollToBooking()">Book Appointment</button>
            </div>
        `).fadeIn();
        return;
    }
    
    let html = '<h3 style="margin-bottom: 1.5rem; color: var(--dark);">Your Bookings:</h3>';
    
    bookings.forEach(booking => {
        const statusColors = {
            pending: { bg: '#fef3c7', text: '#92400e', border: '#feca57' },
            confirmed: { bg: '#dbeafe', text: '#1e40af', border: '#4facfe' },
            completed: { bg: '#d1fae5', text: '#065f46', border: '#43e97b' },
            cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#f5576c' } // Cancelled/Rejected status color
        };
        
        const colors = statusColors[booking.status];
        
        html += `
            <div class="booking-status-card" style="border-left-color: ${colors.border};">
                <h3>
                    <i class="fas fa-calendar-check" style="color: ${colors.border};"></i>
                    Booking #${booking.id}
                </h3>
                <div class="status-detail">
                    <span><i class="fas fa-scissors"></i> Service:</span>
                    <strong>${booking.service_name}</strong>
                </div>
                <div class="status-detail">
                    <span><i class="fas fa-user-tie"></i> Staff:</span>
                    <strong>${booking.staff_name}</strong>
                </div>
                <div class="status-detail">
                    <span><i class="fas fa-calendar"></i> Date:</span>
                    <strong>${booking.booking_date}</strong>
                </div>
                <div class="status-detail">
                    <span><i class="fas fa-clock"></i> Time:</span>
                    <strong>${booking.booking_time}</strong>
                </div>
                <div class="status-detail">
                    <span><i class="fas fa-dollar-sign"></i> Price:</span>
                    <strong>${booking.price}</strong>
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <span class="status-badge-large" style="background: ${colors.bg}; color: ${colors.text};">
                        ${booking.status.toUpperCase()}
                    </span>
                </div>
                ${booking.status === 'pending' ? 
                    '<p style="text-align: center; color: var(--gray); margin-top: 1rem; font-size: 0.9rem;">⏳ Your booking is pending confirmation. We will contact you shortly!</p>' : 
                booking.status === 'confirmed' ? 
                    '<p style="text-align: center; color: var(--success); margin-top: 1rem; font-size: 0.9rem;">✅ Your booking is confirmed! See you soon!</p>' : 
                booking.status === 'completed' ? 
                    '<p style="text-align: center; color: var(--success); margin-top: 1rem; font-size: 0.9rem;">🎉 Thank you for visiting us! We hope to see you again!</p>' : 
                    '<p style="text-align: center; color: var(--danger); margin-top: 1rem; font-size: 0.9rem;">❌ This booking was **REJECTED/CANCELLED**.</p>'
                }
            </div>
        `;
    });
    
    $('#statusResult').html(html).fadeIn();
}

// Load public activity feed (RECENT COMPLETED BOOKINGS)
function loadPublicActivity() {
    $.ajax({
        url: 'api/public_activity.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let html = '';
            
            if (data && data.length > 0) {
                data.forEach(activity => {
                    html += `
                        <div class="activity-item-public">
                            <div class="activity-icon-public">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="activity-content-public">
                                <h4>${activity.service_name}</h4>
                                <p><i class="fas fa-user"></i> ${activity.customer_name} • <i class="fas fa-user-tie"></i> ${activity.staff_name}</p>
                                <span class="activity-time-public">
                                    <i class="fas fa-clock"></i> ${activity.time_ago}
                                </span>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = `
                    <div style="text-align: center; padding: 3rem; color: var(--gray);">
                        <i class="fas fa-calendar" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                        <p>No recent appointments yet</p>
                    </div>
                `;
            }
            
            $('#publicActivityFeed').html(html);
        },
        error: function() {
            console.log('Could not load public activity');
        }
    });
}