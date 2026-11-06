// Бастапқы концерттер
const defaultConcerts = [
    {
        id: 1,
        artist: "RaiM",
        title: "RaiM Concert",
        date: "2026-12-20",
        place: "Алматы Арена",
        price: 8000,
        image: "https://placehold.co/600x400/32175b/ffffff?text=RaiM",
        description: "RaiM әншісінің үлкен концерті.",
        available: 1000
    },
    {
        id: 2,
        artist: "Moldanazar",
        title: "Moldanazar Live",
        date: "2026-12-25",
        place: "Орталық стадион",
        price: 10000,
        image: "https://placehold.co/600x400/32175b/ffffff?text=Moldanazar",
        description: "Moldanazar жанды дауыста өнер көрсетеді.",
        available: 1500
    },
    {
        id: 3,
        artist: "Ninety One",
        title: "Ninety One Show",
        date: "2027-01-10",
        place: "Балуан Шолақ сарайы",
        price: 12000,
        image: "https://placehold.co/600x400/32175b/ffffff?text=Ninety+One",
        description: "Ninety One тобының шоу-концерті.",
        available: 2000
    }
];

// Деректерді браузерде сақтау
if (!localStorage.getItem("concerts")) {
    localStorage.setItem("concerts", JSON.stringify(defaultConcerts));
}

function getConcerts() {
    return JSON.parse(localStorage.getItem("concerts")) || [];
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

// Ақшаны форматтау
function formatPrice(price) {
    return Number(price).toLocaleString("kk-KZ") + " ₸";
}

// Концерт карточкасын жасау
function concertCard(concert) {
    return `
        <div class="concert-card">
            <img src="${concert.image}" alt="${concert.title}">

            <div class="card-info">
                <p>${concert.artist}</p>
                <h3>${concert.title}</h3>
                <p>📅 ${concert.date}</p>
                <p>📍 ${concert.place}</p>

                <div class="card-bottom">
                    <strong>${formatPrice(concert.price)}</strong>

                    <a href="concert.html?id=${concert.id}">
                        Толығырақ
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Басты бетте концерттерді шығару
const concertList = document.getElementById("concertList");

if (concertList) {
    concertList.innerHTML = getConcerts()
        .map(concertCard)
        .join("");
}

// Барлық концерттер беті
const allConcerts = document.getElementById("allConcerts");

if (allConcerts) {
    allConcerts.innerHTML = getConcerts()
        .map(concertCard)
        .join("");
}

// Концерт туралы толық ақпарат
const concertDetails = document.getElementById("concertDetails");

if (concertDetails) {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const concert = getConcerts().find(item => item.id === id);

    if (concert) {
        concertDetails.innerHTML = `
            <div class="concert-card">
                <img src="${concert.image}" alt="${concert.title}">

                <div class="card-info">
                    <h2>${concert.title}</h2>
                    <p>Орындаушы: ${concert.artist}</p>
                    <p>Күні: ${concert.date}</p>
                    <p>Өтетін орны: ${concert.place}</p>
                    <p>${concert.description}</p>
                    <h3>${formatPrice(concert.price)}</h3>
                    <p>Қалған билет: ${concert.available}</p>

                    <a class="btn"
                       href="booking.html?id=${concert.id}">
                       Билет сатып алу
                    </a>
                </div>
            </div>
        `;
    } else {
        concertDetails.innerHTML = "<p>Концерт табылмады.</p>";
    }
}

// Тіркелу
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            alert("Бұл электрондық пошта тіркелген!");
            return;
        }

        users.push({
            id: Date.now(),
            name,
            email,
            password
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Тіркелу сәтті аяқталды!");
        location.href = "login.html";
    });
}

// Жүйеге кіру
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const user = getUsers().find(
            item => item.email === email &&
                    item.password === password
        );

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Қош келдіңіз, " + user.name + "!");
            location.href = "index.html";
        } else {
            alert("Email немесе құпиясөз қате!");
        }
    });
}

// Билетке тапсырыс беру
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const concert = getConcerts().find(item => item.id === id);

    const bookingTitle = document.getElementById("bookingTitle");

    if (!concert) {
        bookingTitle.textContent = "Концерт табылмады";
        bookingForm.querySelector("button").disabled = true;
    } else {
        bookingTitle.textContent =
            concert.title + " — " + formatPrice(concert.price);

        bookingForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("customerName").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const quantity = Number(
                document.getElementById("quantity").value
            );

            const concerts = getConcerts();
            const selected = concerts.find(item => item.id === id);

            if (!selected || quantity < 1 || quantity > selected.available) {
                alert("Билет саны дұрыс емес немесе билет жеткіліксіз!");
                return;
            }

            const orders = getOrders();

            orders.push({
                id: Date.now(),
                customerName: name,
                phone,
                concert: selected.title,
                quantity,
                totalPrice: selected.price * quantity,
                date: new Date().toLocaleString("kk-KZ")
            });

            selected.available -= quantity;

            localStorage.setItem("orders", JSON.stringify(orders));
            localStorage.setItem("concerts", JSON.stringify(concerts));

            alert("Тапсырысыңыз қабылданды!");
            location.href = "index.html";
        });
    }
}

// Әкімші панелі
const adminList = document.getElementById("adminList");

function showAdminConcerts() {
    if (!adminList) return;

    adminList.innerHTML = getConcerts().map(concert => `
        <div class="concert-card card-info">
            <h3>${concert.title}</h3>
            <p>${concert.artist}</p>
            <p>${formatPrice(concert.price)}</p>
            <button class="btn" onclick="deleteConcert(${concert.id})">
                Өшіру
            </button>
        </div>
    `).join("");
}

function deleteConcert(id) {
    const concerts = getConcerts().filter(item => item.id !== id);

    localStorage.setItem("concerts", JSON.stringify(concerts));

    showAdminConcerts();
    alert("Концерт өшірілді!");
}

showAdminConcerts();

// Жаңа концерт қосу
const addConcertForm = document.getElementById("addConcertForm");

if (addConcertForm) {
    addConcertForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const concerts = getConcerts();

        concerts.push({
            id: Date.now(),
            artist: document.getElementById("artist").value,
            title: document.getElementById("title").value,
            date: document.getElementById("date").value,
            place: document.getElementById("place").value,
            price: Number(document.getElementById("price").value),
            image: "https://placehold.co/600x400/32175b/ffffff?text=Concert",
            description: document.getElementById("description").value,
            available: Number(document.getElementById("available").value)
        });

        localStorage.setItem("concerts", JSON.stringify(concerts));

        alert("Жаңа концерт қосылды!");
        addConcertForm.reset();
        showAdminConcerts();
    });
}