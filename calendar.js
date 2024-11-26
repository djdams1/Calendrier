class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.appointments = {};
    
    this.initElements();
    this.initEventListeners();
    this.renderCalendar();
  }

  initElements() {
    this.monthDisplay = document.getElementById('monthDisplay');
    this.calendarGrid = document.getElementById('calendarGrid');
    this.selectedDateDisplay = document.getElementById('selectedDate');
    this.appointmentsList = document.getElementById('appointmentsList');
    this.appointmentTitle = document.getElementById('appointmentTitle');
    this.appointmentTime = document.getElementById('appointmentTime');
  }

  initEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
    document.getElementById('addAppointment').addEventListener('click', () => this.addAppointment());
  }

  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.monthDisplay.textContent = new Date(year, month).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    this.calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day header';
      dayHeader.textContent = day;
      this.calendarGrid.appendChild(dayHeader);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      this.calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;

      const currentDateString = this.formatDate(new Date(year, month, day));
      
      if (this.appointments[currentDateString]) {
        dayElement.classList.add('has-appointments');
      }

      dayElement.addEventListener('click', () => this.selectDate(new Date(year, month, day)));
      
      if (this.selectedDate && 
          day === this.selectedDate.getDate() && 
          month === this.selectedDate.getMonth() && 
          year === this.selectedDate.getFullYear()) {
        dayElement.classList.add('selected');
      }

      this.calendarGrid.appendChild(dayElement);
    }
  }

  changeMonth(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.renderCalendar();
  }

  selectDate(date) {
    this.selectedDate = date;
    this.selectedDateDisplay.textContent = date.toLocaleDateString('fr-FR');
    this.renderCalendar();
    this.renderAppointments();
  }

  addAppointment() {
    if (!this.selectedDate || !this.appointmentTitle.value || !this.appointmentTime.value) {
      alert('Veuillez sélectionner une date et remplir tous les champs');
      return;
    }

    const dateString = this.formatDate(this.selectedDate);
    if (!this.appointments[dateString]) {
      this.appointments[dateString] = [];
    }

    this.appointments[dateString].push({
      title: this.appointmentTitle.value,
      time: this.appointmentTime.value
    });

    this.appointmentTitle.value = '';
    this.appointmentTime.value = '';
    
    this.renderCalendar();
    this.renderAppointments();
  }

  deleteAppointment(dateString, index) {
    this.appointments[dateString].splice(index, 1);
    if (this.appointments[dateString].length === 0) {
      delete this.appointments[dateString];
    }
    this.renderCalendar();
    this.renderAppointments();
  }

  renderAppointments() {
    if (!this.selectedDate) return;

    const dateString = this.formatDate(this.selectedDate);
    const appointments = this.appointments[dateString] || [];
    
    this.appointmentsList.innerHTML = '';
    
    appointments.forEach((appointment, index) => {
      const appointmentElement = document.createElement('div');
      appointmentElement.className = 'appointment-item';
      appointmentElement.innerHTML = `
        <span>${appointment.time} - ${appointment.title}</span>
        <button class="delete-btn" onclick="calendar.deleteAppointment('${dateString}', ${index})">
          Supprimer
        </button>
      `;
      this.appointmentsList.appendChild(appointmentElement);
    });
  }
}

const calendar = new Calendar();