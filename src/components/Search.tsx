import * as React from "react";
import * as Fuse from "fuse.js";
import "./styles/Search.css";

const MINIMUM_TERM_LENGTH = 3;

class Search extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      participants: props.searchList,
      options: {
        keys: ["firstName", "lastName", "email", "studyGroup"],
        shouldSort: true,
        tokenize: true
      },
      searchResults: [],
      searchTerm: "",
      hideSearchResults: true
    };
  }

  handleChange = event => {
    event.preventDefault();

    if (event.target.value.length >= MINIMUM_TERM_LENGTH) {
      if (
        (event.target as HTMLInputElement).value.match(/\w\w([0-9])+/g) !== null
      ) {
        //console.log (this.state.participants);
        const fuse = new Fuse(this.state.participants, {
          keys: ["shortId"],
          shouldSort: true,
          threshold: 0.0
        });

        const results = fuse.search((event.target as HTMLInputElement).value);

        this.setState({
          searchTerm: (event.target as HTMLInputElement).value,
          searchResults: results
        });
      } else {
        const fuse = new Fuse(this.state.participants, this.state.options);

        const results = fuse.search((event.target as HTMLInputElement).value);

        this.setState({
          searchTerm: (event.target as HTMLInputElement).value,
          searchResults: results
        });
      }
    } else {
      this.setState({ searchTerm: (event.target as HTMLInputElement).value });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  handleFocus = event => {
    event.preventDefault();
    this.setState({ hideSearchResults: false });
  };

  handleBlur = event => {
    event.preventDefault();
    this.setState({ hideSearchResults: true });
  };

  render() {
    let searchResultsBox;
    if (
      this.state.searchTerm.length >= MINIMUM_TERM_LENGTH &&
      !this.state.hideSearchResults
    ) {
      searchResultsBox = (
        <div className="search-results-wrapper">
          {this.state.searchResults.length > 0 ? (
            this.state.searchResults.map((element, index) => (
              <div key={index} className="search-result">
                <div className="search-name">
                  {element.firstName} {element.lastName}
                </div>
                <div className="search-participant-details">{element.shortId} &sdot; {element.email} &sdot; {element.studyGroup}</div>
              </div>
            ))
          ) : (
            <div className="search-no-results">No matches found.</div>
          )}
        </div>
      );
    } else {
      searchResultsBox = null;
    }

    return (
      <div className="search-wrapper">
        <form
          className="search-form-wrapper"
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <input
            className="search-box"
            type="text"
            placeholder="Search"
            id="searchTerm"
            onChange={this.handleChange}
            value={this.state.searchTerm}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <button className="search-button" type="submit">
            <i className="material-icons search-icon">search</i>
          </button>
        </form>
        {searchResultsBox}
      </div>
    );
  }
}

export default Search;
