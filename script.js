document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const openingScreen = document.getElementById("openingScreen");
    const openInvitation = document.getElementById("openInvitation");
    const mainWebsite = document.getElementById("mainWebsite");

    const musicButton = document.getElementById("musicButton");
    const backgroundMusic = document.getElementById("backgroundMusic");

    const scratchCanvas = document.getElementById("scratchCanvas");
    const scratchHeart = document.querySelector(".scratch-heart");

    const messageForm = document.getElementById("messageForm");
    const formMessage = document.getElementById("formMessage");


    /* =====================================================
       OPEN INVITATION
    ===================================================== */

    if (openInvitation) {

        openInvitation.addEventListener("click", function () {

            if (!openingScreen || !mainWebsite) {
                return;
            }

            if (openingScreen.classList.contains("opening-closing")) {
                return;
            }

            openingScreen.classList.add("opening-closing");

            setTimeout(function () {

                openingScreen.classList.add("hidden");

                mainWebsite.classList.remove("hidden");

                requestAnimationFrame(function () {
                    mainWebsite.classList.add("show");
                });

                document.body.style.overflowX = "hidden";

                initializeScratch();

            }, 1100);

        });

    }


    /* =====================================================
       MUSIC
    ===================================================== */

    if (musicButton && backgroundMusic) {

        musicButton.addEventListener("click", function () {

            if (!backgroundMusic.src) {
                musicButton.textContent = "♫";
                return;
            }

            if (backgroundMusic.paused) {

                backgroundMusic.play()
                    .then(function () {
                        musicButton.textContent = "❚❚";
                    })
                    .catch(function () {
                        musicButton.textContent = "♫";
                    });

            } else {

                backgroundMusic.pause();

                musicButton.textContent = "♫";

            }

        });

    }


    /* =====================================================
       COUNTDOWN
       10 OCTOBER 2026 — 6:00 PM
       PAKISTAN TIME (+05:00)
    ===================================================== */

    const weddingDate =
        new Date("2026-10-10T18:00:00+05:00").getTime();

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");


    function updateCountdown() {

        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }

        const now = new Date().getTime();

        const distance = weddingDate - now;


        if (distance <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            return;
        }


        const days =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (distance %
                    (1000 * 60 * 60 * 24)) /
                    (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (distance %
                    (1000 * 60 * 60)) /
                    (1000 * 60)
            );

        const seconds =
            Math.floor(
                (distance %
                    (1000 * 60)) /
                    1000
            );


        daysElement.textContent =
            String(days).padStart(2, "0");

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");
    }


    updateCountdown();

    setInterval(updateCountdown, 1000);


    /* =====================================================
       SCRATCH CARD
    ===================================================== */

    let scratchInitialized = false;


    function initializeScratch() {

        if (
            !scratchCanvas ||
            !scratchHeart ||
            scratchInitialized
        ) {
            return;
        }

        const rect = scratchHeart.getBoundingClientRect();

        if (
            rect.width === 0 ||
            rect.height === 0
        ) {
            setTimeout(initializeScratch, 300);
            return;
        }


        scratchInitialized = true;


        const ctx =
            scratchCanvas.getContext("2d", {
                willReadFrequently: true
            });


        const dpr =
            Math.max(
                1,
                Math.min(window.devicePixelRatio || 1, 2)
            );


        const width = rect.width;
        const height = rect.height;


        scratchCanvas.width =
            Math.round(width * dpr);

        scratchCanvas.height =
            Math.round(height * dpr);


        scratchCanvas.style.width =
            width + "px";

        scratchCanvas.style.height =
            height + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        /* ---------------------------------------------
           PINK SCRATCH COVER
        --------------------------------------------- */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                width,
                height
            );

        gradient.addColorStop(
            0,
            "#eaa4b7"
        );

        gradient.addColorStop(
            0.45,
            "#d77f99"
        );

        gradient.addColorStop(
            1,
            "#b95c79"
        );


        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* ---------------------------------------------
           PINK SHINE
        --------------------------------------------- */

        const shine =
            ctx.createRadialGradient(
                width * .35,
                height * .25,
                10,
                width * .5,
                height * .5,
                width * .7
            );

        shine.addColorStop(
            0,
            "rgba(255,255,255,.28)"
        );

        shine.addColorStop(
            .5,
            "rgba(255,255,255,.06)"
        );

        shine.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );


        ctx.fillStyle = shine;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* ---------------------------------------------
           HEART / DECORATION ON COVER
        --------------------------------------------- */

        ctx.fillStyle =
            "rgba(255,255,255,.18)";

        ctx.font =
            "34px serif";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            "♡",
            width / 2,
            height / 2 - 65
        );


        /* ---------------------------------------------
           SCRATCH SETTINGS
        --------------------------------------------- */

        ctx.globalCompositeOperation =
            "destination-out";


        let isScratching = false;

        let lastX = 0;
        let lastY = 0;


        function getPosition(event) {

            const canvasRect =
                scratchCanvas.getBoundingClientRect();

            let clientX;
            let clientY;


            if (event.touches && event.touches.length) {

                clientX =
                    event.touches[0].clientX;

                clientY =
                    event.touches[0].clientY;

            } else if (
                event.changedTouches &&
                event.changedTouches.length
            ) {

                clientX =
                    event.changedTouches[0].clientX;

                clientY =
                    event.changedTouches[0].clientY;

            } else {

                clientX = event.clientX;
                clientY = event.clientY;

            }


            return {
                x:
                    clientX -
                    canvasRect.left,

                y:
                    clientY -
                    canvasRect.top
            };
        }


        function scratchAt(x, y) {

            const radius = 32;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            if (
                lastX !== 0 ||
                lastY !== 0
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    lastX,
                    lastY
                );

                ctx.lineTo(
                    x,
                    y
                );

                ctx.lineWidth =
                    radius * 2;

                ctx.lineCap =
                    "round";

                ctx.stroke();

            }


            lastX = x;
            lastY = y;
        }


        function startScratch(event) {

            event.preventDefault();

            isScratching = true;

            const position =
                getPosition(event);

            lastX = position.x;
            lastY = position.y;

            scratchAt(
                position.x,
                position.y
            );
        }


        function moveScratch(event) {

            if (!isScratching) {
                return;
            }

            event.preventDefault();

            const position =
                getPosition(event);

            scratchAt(
                position.x,
                position.y
            );

            checkScratchProgress();
        }


        function stopScratch(event) {

            if (!isScratching) {
                return;
            }

            if (event) {
                event.preventDefault();
            }

            isScratching = false;

            lastX = 0;
            lastY = 0;

            checkScratchProgress();
        }


        /* MOUSE */

        scratchCanvas.addEventListener(
            "mousedown",
            startScratch
        );

        window.addEventListener(
            "mousemove",
            moveScratch
        );

        window.addEventListener(
            "mouseup",
            stopScratch
        );


        /* TOUCH */

        scratchCanvas.addEventListener(
            "touchstart",
            startScratch,
            { passive: false }
        );

        scratchCanvas.addEventListener(
            "touchmove",
            moveScratch,
            { passive: false }
        );

        scratchCanvas.addEventListener(
            "touchend",
            stopScratch,
            { passive: false }
        );

        scratchCanvas.addEventListener(
            "touchcancel",
            stopScratch,
            { passive: false }
        );


        /* POINTER SUPPORT */

        scratchCanvas.addEventListener(
            "pointerdown",
            function (event) {

                if (
                    event.pointerType === "mouse"
                ) {
                    return;
                }

                event.preventDefault();

                try {
                    scratchCanvas.setPointerCapture(
                        event.pointerId
                    );
                } catch (error) {}

                startScratch(event);
            }
        );

        scratchCanvas.addEventListener(
            "pointermove",
            function (event) {

                if (
                    event.pointerType === "mouse"
                ) {
                    return;
                }

                moveScratch(event);
            }
        );

        scratchCanvas.addEventListener(
            "pointerup",
            function (event) {

                if (
                    event.pointerType === "mouse"
                ) {
                    return;
                }

                stopScratch(event);
            }
        );


        /* ---------------------------------------------
           CHECK HOW MUCH IS SCRATCHED
        --------------------------------------------- */

        let lastCheck = 0;


        function checkScratchProgress() {

            const now =
                Date.now();

            if (
                now - lastCheck < 250
            ) {
                return;
            }

            lastCheck = now;


            const sampleWidth =
                Math.min(
                    scratchCanvas.width,
                    120
                );

            const sampleHeight =
                Math.min(
                    scratchCanvas.height,
                    120
                );


            try {

                const imageData =
                    ctx.getImageData(
                        0,
                        0,
                        scratchCanvas.width,
                        scratchCanvas.height
                    );

                const pixels =
                    imageData.data;

                let transparent = 0;

                let total =
                    pixels.length / 4;


                for (
                    let i = 3;
                    i < pixels.length;
                    i += 4
                ) {

                    if (
                        pixels[i] < 100
                    ) {
                        transparent++;
                    }

                }


                const percentage =
                    (transparent / total) * 100;


                if (
                    percentage > 38
                ) {

                    scratchHeart.classList.add(
                        "scratched"
                    );

                    ctx.clearRect(
                        0,
                        0,
                        width,
                        height
                    );
                }

            } catch (error) {

                console.log(
                    "Scratch progress error:",
                    error
                );

            }
        }

    }


    /* =====================================================
       INITIALIZE SCRATCH WHEN MAIN OPENS
    ===================================================== */

    if (
        mainWebsite &&
        !mainWebsite.classList.contains("hidden")
    ) {
        setTimeout(
            initializeScratch,
            500
        );
    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });


    /* =====================================================
       MESSAGE FORM
    ===================================================== */

    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (formMessage) {

                    formMessage.textContent =
                        "Thank you for your beautiful message. ♥";

                }

                messageForm.reset();

            }
        );

    }


    /* =====================================================
       FLOATING HEARTS
    ===================================================== */

    function createFloatingHeart() {

        const heart =
            document.createElement("div");

        heart.innerHTML = "♥";

        heart.style.position =
            "fixed";

        heart.style.left =
            Math.random() * 100 + "vw";

        heart.style.bottom =
            "-30px";

        heart.style.fontSize =
            (12 + Math.random() * 18) + "px";

        heart.style.color =
            "rgba(217,140,157,.55)";

        heart.style.pointerEvents =
            "none";

        heart.style.zIndex =
            "20";

        heart.style.transition =
            "transform 7s linear, opacity 7s linear";

        document.body.appendChild(heart);


        requestAnimationFrame(function () {

            heart.style.transform =
                "translateY(-110vh) rotate(25deg)";

            heart.style.opacity =
                "0";

        });


        setTimeout(function () {

            heart.remove();

        }, 7200);

    }


    setInterval(
        createFloatingHeart,
        2200
    );


});