title: AntoloGaia
learning_outcome:
level:
citation_information:
thumbnail: /assets/media/porpora.jpeg # Image to show in browse lesson grid
lezioni: AntoloGaia # Relation to Italian version of the lesson

## Filters
- Grammar
    - articles
        - definitive

    - verbs 
    - pronouns

- Vocabulary 
- Culture
- Level



  - label: "Profile"
    name: "profile"
    widget: "object"
    fields:
      - {label: "Public", name: "public", widget: "boolean", default: true}
      - {label: "Name", name: "name", widget: "string"}
      - label: "Birthdate"
        name: "birthdate"
        widget: "date"
        default: ""
        format: "MM/DD/YYYY"
      - label: "Address"
        name: "address"
        widget: "object"
        fields: 
          - {label: "Street Address", name: "street", widget: "string"}
          - {label: "City", name: "city", widget: "string"}
          - {label: "Postal Code", name: "post-code", widget: "string"}
