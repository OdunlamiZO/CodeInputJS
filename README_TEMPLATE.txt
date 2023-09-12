# CodeInputJS

Creates a simple HTML input used to collect digit values in the form of otp, verification code, etc.

## Usage

To use add the following to the head section of the HTML file

```html
<script src="https://cdn.statically.io/gh/OdunlamiZO/CodeInputJS/${COMMIT_HASH}/src/CodeInputJS.min.js"></script>
```
Then, add a div with id **ci** into the form where you want the input. An example is given as follow

```html
<form action="/verify" method="post">
    <div id="ci"></div>
    <input type="submit" name="submit" value="Verify & Continue">
</form>
```

The entire input can be styled using the selector **#ci** and each field using **.ci-field**. It is important to note however that some properties cannot be overriden and some can be customized using the method shown by the following

```html
<div id="ci" ci-length="6" ci-width-x="0.8" ci-class=" flex-column"></div>
```

### Length

This determines the input's field count, which is by default set to 4.

### Width-X

Adopts a value that is unique to the range of 0 to 1. It adjusts the input width in relation to the width of its container and has a default value of 1.

### Class

Applied to the fields to add class attributes. Takes a list of class names that separated by space.

## Contributing

I gladly welcome ideas from you, submit a pull request implementing that idea of yours. To be implemented though is validation on submit.
Thank you 😘