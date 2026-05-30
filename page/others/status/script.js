const subscribeBtn = document.getElementById("subscribeBtn");
const popup = document.getElementById("popup");

const tabs = document.querySelectorAll(".popup-tabs button");

const popupContent = document.querySelector(".popup-content");

// OPEN / CLOSE

subscribeBtn.addEventListener("click", () => {

  popup.classList.toggle("active");

});

window.addEventListener("click", (e) => {

  if(
    !popup.contains(e.target) &&
    !subscribeBtn.contains(e.target)
  ){

    popup.classList.remove("active");

  }

});

const contents = [

  `
    <p>
      Subscribe to receive updates on ongoing incidents or upcoming maintenances via email.
    </p>

    <div class="input-box">
      <label>Subscriber Name <span>*</span></label>
      <input type="text" placeholder="P.Boyle">
    </div>

    <div class="input-box">
      <label>Email Address <span>*</span></label>
      <input type="email" placeholder="p.boyle@zylker.com">
    </div>

    <div class="captcha">

      <div class="captcha-box">
        H6E6KL
      </div>

      <button class="refresh">
        ↻
      </button>

    </div>

    <div class="input-box">
      <label>Enter CAPTCHA <span>*</span></label>
      <input type="text">
    </div>

    <button class="submit-btn">
      Subscribe to email notifications
    </button>

    <a href="#" class="manage">
      Manage Existing Subscription
    </a>
  `,


  `
    <p>
      Receive service alerts and incident updates directly on your phone via SMS.
    </p>

    <div class="input-box">
      <label>Phone Number <span>*</span></label>
      <input type="text" placeholder="+998 99 123 45 67">
    </div>

    <div class="input-box">
      <label>Country <span>*</span></label>
      <input type="text" placeholder="Uzbekistan">
    </div>

    <button class="submit-btn">
      Subscribe to SMS notifications
    </button>

    <a href="#" class="manage">
      Manage Existing Subscription
    </a>
  `,

  `
    <p>
      Add TMDB maintenance schedules and incident timelines directly to your calendar.
    </p>

    <div class="input-box">
      <label>Calendar Email <span>*</span></label>
      <input type="email" placeholder="calendar@email.com">
    </div>

    <button class="submit-btn">
      Connect Calendar
    </button>

    <a href="#" class="manage">
      View Upcoming Maintenance
    </a>
  `,

  `
    <p>
      Subscribe using RSS feed to receive live updates in your favorite RSS reader.
    </p>

    <div class="input-box">
      <label>RSS Feed URL</label>
      <input type="text" value="https://status.themoviedb.org/rss" readonly>
    </div>

    <button class="submit-btn">
      Copy RSS Feed
    </button>

    <a href="#" class="manage">
      Learn About RSS
    </a>
  `

];
tabs.forEach((tab, index) => {

  tab.addEventListener("click", () => {


    tabs.forEach(btn => {

      btn.classList.remove("active");

    });


    tab.classList.add("active");


    popupContent.innerHTML = contents[index];

  });

});

document.addEventListener("click", (e) => {

  if(e.target.classList.contains("submit-btn")){

    if(e.target.innerText.includes("Copy RSS")){

      navigator.clipboard.writeText(
        "https://status.themoviedb.org/rss"
      );

      e.target.innerText = "Copied ✓";

    }

  }

});


