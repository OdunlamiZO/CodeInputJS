window.onload = function () {
	const codeInput = document.getElementById("ci");
	// Style CodeInput
	let widthFactor = codeInput.getAttribute("ci-width-x") || "1.0"; // Value is set with ci-width-x
	widthFactor = parseFloat(widthFactor);
	widthFactor = widthFactor > 0 && widthFactor < 1.0 ? widthFactor : 1.0;
	const width = widthFactor * 100;
	codeInput.style.cssText +=
		" display: flex; align-items: center; justify-content: space-between; width: " +
		width +
		"%;";
	// Create fields
	let inputLength = codeInput.getAttribute("ci-length") || "4"; // Value is set with ci-length
	inputLength = parseInt(inputLength, 10);
	for (let i = 0; i < inputLength; i++) {
		const field = document.createElement("input");
		field.type = "text";
		field.classList.add("ci-field");
		if (codeInput.getAttribute("ci-class")) {
			field.classList.add(codeInput.getAttribute("ci-class")); // Value is set with ci-class
		}
		const fieldWidth = (0.85 * width) / inputLength;
		field.style.cssText += " width: " + fieldWidth + "%; text-align: center;";
		codeInput.appendChild(field);
	}

	const fields = document.querySelectorAll(".ci-field");
	fields.forEach((field, index) => {
		field.setAttribute("ci-index", index);
		field.setAttribute("ci-initial", "");
		field.addEventListener("keydown", handleKeyEvent);
		field.addEventListener("input", handleInput);
		field.addEventListener("paste", handlePaste);
	});

	function handleKeyEvent(event) {
		const field = event.target;
		if (event.key === "Backspace") {
			field.setAttribute("ci-initial", field.value);
		}
		if (event.key === "Delete") {
			field.setAttribute("ci-initial", field.value);
		}
		const index = field.getAttribute("ci-index");
		if (event.key === "ArrowRight") {
			if (index < fields.length - 1) {
				field.nextElementSibling.focus();
			}
		}
		if (event.key === "ArrowLeft") {
			if (index > 0) {
				const previous = field.previousElementSibling;
				previous.focus();
				setTimeout(function () {
					previous.selectionStart = previous.selectionEnd =
						previous.value.length;
				}, 0);
			}
		}
	}

	function handleInput(event) {
		const field = event.target;
		const index = field.getAttribute("ci-index");
		if (field.value.length < field.getAttribute("ci-initial").length) {
			if (index > 0) {
				const previous = field.previousElementSibling;
				previous.focus();
				setTimeout(function () {
					previous.selectionStart = previous.selectionEnd =
						previous.value.length;
				}, 0);
			}
			field.setAttribute("ci-initial", field.value);
			return;
		}
		const pattern = /^\d+$/;
		if (pattern.test(field.value)) {
			field.value = getAddedCharacter(
				field.getAttribute("ci-initial"),
				field.value
			);
			if (index < fields.length - 1) {
				field.nextElementSibling.focus();
			}
			field.setAttribute("ci-initial", field.value);
			return;
		}
		field.value = field.getAttribute("ci-initial");
	}

	function handlePaste(event) {
		const data = event.clipboardData.getData("text");
		const pattern = /^\d+$/;
		if (pattern.test(data)) {
			const value = data.split("");
			for (let i = 0; i < value.length; i++) {
				fields[i].value = value[i];
			}
			fields[value.length - 1].focus();
		}
	}

	function getAddedCharacter(previousValue, currentValue) {
		for (let i = 0; i < currentValue.length; i++) {
			if (previousValue.charAt(i) !== currentValue.charAt(i)) {
				return currentValue.charAt(i);
			}
		}
		return "";
	}

	codeInput.closest("form").addEventListener("keyup", function (event) {
		event.preventDefault();
		if (event.key === "Enter") {
			const submitter = this.querySelector(
				"input[type='submit'], button[type='submit']"
			);
			submitter.focus();
			submitter.click();
		}
	});

	codeInput.closest("form").addEventListener("submit", function (event) {
		event.preventDefault();
		let code = "";
		for (let i = 0; i < fields.length; i++) {
			code += fields[i].value;
		}
		// validate code length
		const params = new URLSearchParams();
		params.append("code", code);
		let submitter = null;
		const possibleSubmitters = this.querySelectorAll(
			"input[type='submit'], button[type='submit']"
		);
		for (let i = 0; i < possibleSubmitters.length; i++) {
			if (document.activeElement === possibleSubmitters[i]) {
				submitter = possibleSubmitters[i];
				break;
			}
		}
		params.append(submitter.name, submitter.value);
		fetch(this.action, {
			method: this.method,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		})
			.then(function (response) {
				if (response.redirected) {
					window.location.href = response.url;
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	});
};
