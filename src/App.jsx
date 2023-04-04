import React, { Component } from "react";
import shortid from "shortid";

import { PhoneBook } from "components/PhoneBook";
import { PBForm } from "components/PBForm";
import { ContactFilter } from "components/ContactFilter";
import { ContactList } from "components/ContactList";

import { Contacts, Title } from "components/Contacts";

class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem("localContacts"));

    if (contacts) this.setState({ contacts });
  }

  addContact = ({ name, number }) => {
    const { contacts } = this.state;

    const haveContact = contacts.some((contact) => {
      return contact.name.toLowerCase() === name.toLowerCase();
    });

    if (haveContact) {
      alert(`${name} is already in contacts`);
      return;
    }

    const newContact = {
      id: shortid.generate(),
      name,
      number,
    };

    this.setState((prevState) => ({
      contacts: [newContact, ...prevState.contacts],
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      localStorage.setItem(
        "localContacts",
        JSON.stringify(this.state.contacts)
      );
    }
  }

  changeFilter = (e) => {
    this.setState({ filter: e.target.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;

    const normalized = filter.toLowerCase();

    return contacts.filter((contact) => {
      return contact.name.toLowerCase().includes(normalized);
    });
  };

  deleteContact = (ContactId) => {
    this.setState((precState) => ({
      contacts: precState.contacts.filter(
        (contact) => contact.id !== ContactId
      ),
    }));
  };

  render() {
    const { filter } = this.state;

    const visibleContacts = this.getVisibleContacts();

    return (
      <>
        <PhoneBook title="PhoneBook">
          <PBForm onSubmit={this.addContact} />
          <Contacts>
            <Title>Contacts</Title>
            <ContactFilter onChange={this.changeFilter} value={filter} />
            <ContactList
              contacts={visibleContacts}
              onDeleteContact={this.deleteContact}
            />
          </Contacts>
        </PhoneBook>
      </>
    );
  }
}

export { App };
