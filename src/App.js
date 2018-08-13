// import { BrowserRouter, Route, Link } from "react-router-dom";
// import SearchBar from "./SearchBar";
import "./App.css";
import Credentials from "./FoursquareCredentials";
import Map from "./MapContainer";
import MenuButton from "./MenuButton";
import Modal from "./Modal";
import React, { Component } from "react";
import SideBar from "./SideBar";

// Setup Shortcuts
const ENTER_BUTTON = 13;
const ESCAPE_BUTTON = 27;

class App extends Component {
  state = {
    locations: [],
    venueInfo: {},
    query: ""
  };
  componentDidMount() {
    document.addEventListener("keyup", e => {
      e.preventDefault();
      // Escape button closes the sidebar.
      if (e.keyCode === ESCAPE_BUTTON) {
        document.querySelector(".sidebar").classList.toggle("sidebar-expanded");
        document.querySelector(".menu-btn").classList.toggle("menu-btn-hidden");
      }
    });

    // Setup Foursquare API
    fetch(
      `https://api.foursquare.com/v2/venues/explore?ll=59.9115,10.7579&client_id=${
        Credentials.client_id
      }&client_secret=${Credentials.client_secret}&v=${
        Credentials.version_date
      }&query=food&radius=1600&categoryId=4d4b7105d754a06374d81259&limit=64`
    )
      .then(repsonse => repsonse.json())
      .then(data => {
        const locations = data.response.groups[0].items.map(item => {
          return {
            position: {
              lat: item.venue.location.lat,
              lng: item.venue.location.lng
            },
            title: item.venue.name,
            id: item.venue.id,
            category: item.venue.categories[0].name,
            address: item.venue.location.address,
            state: item.venue.location.state,
            coordinates:
              item.venue.location.lat + ", " + item.venue.location.lng
          };
        });

        this.setState({ locations });
      })
      .catch(err => {
        console.log("Failed to fetch Foursquare data.", err);
      });
  }

  menuButtonHandler = e => {
    // Hide the menu button.
    e.target.classList.add("menu-btn-hidden");

    // Display the sidebar.
    document.querySelector(".sidebar").classList.add("sidebar-expanded");
  };

  // Close the sidebar.
  closeButtonHandler = e => {
    document.querySelector(".sidebar").classList.remove("sidebar-expanded");
    // Show menu button.
    document.querySelector(".menu-btn").classList.remove("menu-btn-hidden");
  };

  sidebarItemClick = e => {
    // Remove markers that are not a match.
    this.setState({
      query: e.target.textContent.replace(/- /g, "")
    });

    const modal = document.querySelector(".details-modal");
    // Search for clicked location and retrieve its data.
    for (const location of this.state.locations) {
      if (location.title === e.target.textContent.replace(/- /g, "")) {
        this.setState({ venueInfo: location });
        modal.style.display = "block";
        modal.style.opacity = "1";
      }
    }
  };

  sidebarInputClick = e => {
    this.setState({
      query: ""
    });
    // Pop-up modal when the location is clicked in the search bar.
    const modal = document.querySelector(".details-modal");

    modal.style.opacity = "0";

    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  };

  sidebarItemKeyUp = e => {
    if (e.keyCode === ENTER_BUTTON) {
      this.setState({
        query: e.target.textContent.replace(/- /g, "")
      });
    }
  };

  // Close the modal.
  modalCloseButton = e => {
    const modal = document.querySelector(".details-modal");

    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  };

  updateQuery = e => {
    this.setState({
      query: e.target.value
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Best <span role="img">🍽</span> Places in Oslo
          </h1>
          <p className="credit">
            Data obtained from Google Maps and Foursquare.
          </p>
          <MenuButton onMenClick={this.menuButtonHandler} />
        </header>
        <Modal
          venueInfo={this.state.venueInfo}
          closeModal={this.modalCloseButton}
        />

        <SideBar
          onCloseClick={this.closeButtonHandler}
          places={this.state.locations}
          currentQuery={this.state.query}
          onQueryInput={this.updateQuery}
          onItemClick={this.sidebarItemClick}
          onInputClick={this.sidebarInputClick}
          onItemFocus={this.sidebarItemFocus}
          onItemKeyUp={this.sidebarItemKeyUp}
        />

        <div className="map">
          <Map queryText={this.state.query} locations={this.state.locations} />
        </div>
      </div>
    );
  }
}

export default App;
