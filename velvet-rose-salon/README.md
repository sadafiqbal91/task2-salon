# Velvet Rose Salon

A fully responsive 5-page business website for a beauty salon, built with **HTML5, CSS3 and Vanilla JavaScript**.
No frameworks, libraries or build tools. Just open `index.html`.

## Pages
- `index.html` - Home (hero with typing animation, counters, services, why us, gallery slider, testimonials, CTA)
- `about.html` - About (story, values, team, timeline)
- `services.html` - Services (6 service cards with prices, process, FAQ accordion)
- `portfolio.html` - Portfolio (filterable gallery of 9 works)
- `contact.html` - Contact (info panel, validated booking form, map placeholder)

## JavaScript features (`js/main.js`)
1. Dark / light mode (saved with localStorage)
2. Responsive navigation menu (full-screen on mobile, closes on link click and ESC)
3. Typing animation
4. Animated counters (IntersectionObserver)
5. Image slider (gallery) and testimonial slider (autoplay, arrows, dots, keyboard)
6. FAQ accordion
7. Portfolio filter with empty state
8. Booking form validation (on blur and on submit, error/success states)
9. Scroll-to-top button
10. Scroll reveal animation

## Run locally
Open `index.html` in a browser, or use the VS Code **Live Server** extension.

## Make it yours (important)
- Replace the sample contact details (phone, email, address) in every page footer and in `contact.html`.
- Colour panels with a small icon are placeholders. To use real photos, put images in `images/` and replace a `<div class="art ...">...</div>` with `<img src="images/your-photo.jpg" alt="Describe the photo">`.
- Add your name/credit in the footer if you like.

## Deploy
**GitHub Pages:** push the folder to a repo, then Settings > Pages > Branch `main` / root > Save.
**Netlify:** drag and drop the folder at app.netlify.com/drop.

## Author
**Sadaf Iqbal** - Devixo Solutions Web Development Internship, Task 02

## Screenshots and report
- `screenshots/` has code, desktop, mobile and dark-mode screenshots.
- `Report_Velvet_Rose_Salon_Task02.pdf` is the full task report.
