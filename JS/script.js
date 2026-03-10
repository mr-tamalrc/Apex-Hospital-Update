const slots = {
	"Dr. Amit Sharma": ["10:00 AM", "11:00 AM", "12:00 PM"],
	"Dr. Arthur Concepion": ["01:00 PM", "02:00 PM", "03:00 PM"],
	"Dr. Rahul Roy": ["04:00 PM", "05:00 PM"],
	"Dr. Herman Garter": ["10:00 AM", "02:00 PM"],
	"Dr. Arjun Ghosh": ["12:00 PM", "03:00 PM", "06:00 PM"],
};

function loadSlots() {
	const doctor = document.getElementById("doctor").value;
	const timeSelect = document.getElementById("time");
	if (!timeSelect) return;

	timeSelect.innerHTML = "";
	if (slots[doctor]) {
		slots[doctor].forEach((t) => {
			let opt = document.createElement("option");
			opt.value = t;
			opt.text = t;
			timeSelect.add(opt);
		});
	}
}

const admissionForm = document.getElementById("admission-form");
if (admissionForm) {
	admissionForm.addEventListener("submit", function (e) {
		e.preventDefault();
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const doctor = document.getElementById("doctor").value;
		const time = document.getElementById("time").value;
		const date = document.getElementById("date").value;

		window.location.href = `payment.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&doctor=${encodeURIComponent(doctor)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;
	});
}
if (window.location.pathname.includes("payment.html")) {
	const params = new URLSearchParams(window.location.search);
	const fullName = params.get("name") || "N/A";

	const boxes = document.querySelectorAll(".box p");
	if (boxes.length > 0) {
		boxes[0].innerHTML = `<b>Patient:</b> ${fullName}`;
		boxes[1].innerHTML = `<b>Doctor:</b> ${params.get("doctor") || "N/A"}`;
		boxes[2].innerHTML = `<b>Email:</b> ${params.get("email") || "N/A"}`;
		boxes[3].innerHTML = `<b>Date:</b> ${params.get("date") || "N/A"}`;
		boxes[4].innerHTML = `<b>Time:</b> ${params.get("time") || "N/A"}`;
	}

	if (fullName !== "N/A") {
		let firstName = fullName.split(" ")[0].toLowerCase();
		let userID = firstName + Math.floor(Math.random() * 100);
		let password = firstName + "@123";

		const highlights = document.querySelectorAll(".highlight");
		if (highlights.length >= 2) {
			highlights[0].innerText = userID;
			highlights[1].innerText = password;
		}

		localStorage.setItem("patient_user", userID);
		localStorage.setItem("patient_pass", password);
		localStorage.setItem("patient_name", fullName);
	}

	const baseAmount = 600;
	const gstRate = 0.18;
	const bedPrices = {
		standard: 1000,
		moderate: 2000,
		premium: 3000,
	};

	let rooms = {
		standard: 5,
		moderate: 3,
		premium: 2,
	};

	const packageSelect = document.getElementById("admission-type");
	const bedSelect = document.getElementById("bed-type");

	function calculateBill() {
		const days = parseInt(daysSelect.value);
		const bedType = bedSelect.value;

		if (!days || !bedType) return;

		let admissionCost = days * bedPrices[bedType];
		let total = baseAmount + admissionCost;

		const gst = total * gstRate;
		total += gst;

		if (days >= 20) {
			total -= total * 0.05;
		}

		document.getElementById("finalTotal").innerText = total.toFixed(2);

		const upiLink = `upi://pay?pa=hospital@upi&pn=ApexHospital&am=${total}&cu=INR`;
		const qrImg = document.querySelector(".qr img");
		if (qrImg) {
			qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
		}
	}

	if (packageSelect) packageSelect.addEventListener("change", calculateBill);
	if (bedSelect) bedSelect.addEventListener("change", calculateBill);
}

function handleLogin() {
	const u = document.getElementById("username").value;
	const p = document.getElementById("password").value;
	const storedU = localStorage.getItem("patient_user");
	const storedP = localStorage.getItem("patient_pass");

	if (u === storedU && p === storedP) {
		window.location.href = "user.html";
	} else {
		alert(
			"Invalid Credentials! Please check the details from your payment slip.",
		);
	}
}

if (window.location.pathname.includes("user.html")) {
	const pName = localStorage.getItem("patient_name");
	const welcomeHeading = document.querySelector(".user-welcome h2");
	if (pName && welcomeHeading) {
		welcomeHeading.innerText = `Welcome, ${pName}`;
	}
}

const signupForm = document.querySelector(".login-form");

if (window.location.pathname.includes("signup.html") && signupForm) {
	signupForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const fullName = document.getElementById("fullname").value;
		const email = document.getElementById("email").value;
		const phone = document.getElementById("phone").value;
		const username = document.getElementById("username").value;
		const pass = document.getElementById("password").value;
		const confirmPass = document.getElementById("confirm-password").value;

		if (pass !== confirmPass) {
			alert("Passwords do not match!");
			return;
		}

		localStorage.setItem("patient_name", fullName);
		localStorage.setItem("patient_user", username);
		localStorage.setItem("patient_pass", pass);

		alert("Registration Successful! Now you can Login.");
		window.location.href = "login.html";
	});
}
