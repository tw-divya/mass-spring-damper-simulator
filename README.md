# Mass-Spring-Damper PBL Simulation
Vanilla HTML/CSS/JS. Open with VS Code **Live Server** (start at `index.html`) or deploy the folder to **GitHub Pages**.
Model: m x'' + c x' + k x = F(t), solved with RK4; impulses are applied as a velocity jump v += J/m.
Validate the maths: `node tests/validate.js` (classification tests 1-4, RK4 vs exact inverse-Laplace for free/step/impulse/sine, impulse jump, dt stability).
Edit student/faculty names in `index.html`. The three damping cases are tolerance-based (|ζ−1| < 1e-3).
