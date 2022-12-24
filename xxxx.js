fetch("metadata/metadata.json")
  .then((response) => response.json())
  .then((nftItems) => {
    const uniqueTraits = new Set();
    const filterRadios = document.querySelector(".filter");

    for (const nftItem of nftItems) {
      for (const attribute of nftItem.attributes) {
        uniqueTraits.add(attribute.trait_category);
      }
    }

    for (const trait of uniqueTraits) {
      const radioCategory = document.createElement("div");
      radioCategory.id = trait;
      radioCategory.style.display = "none";

      const categoryTitle = document.createElement("button");
      categoryTitle.textContent = trait;
      categoryTitle.onclick = () => {
        const div = document.getElementById(trait);
        div.style.display = div.style.display === "none" ? "block" : "none";
      };

      radioCategory.appendChild(categoryTitle);

      for (const nftItem of nftItems) {
        for (const attribute of nftItem.attributes) {
          if (attribute.trait_category === trait) {
            // Check if trait is already present in radioCategory
            let found = false;
            for (const radio of radioCategory.querySelectorAll("input[type=radio]")) {
              if (radio.value === attribute.trait_info.trait) {
                found = true;
                break;
              }
            }
            // If trait is not present in radioCategory, add it
            if (!found) {
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "trait-options";
                radio.id = attribute.trait_info.trait;
                radio.value = attribute.trait_info.trait;
                radio.onchange = () => {
                // Filter NFT items based on selected trait
                for (const nftItem of nftItems) {
                    let found = false;
                    for (const attribute of nftItem.attributes) {
                        if (attribute.trait_info.trait === radio.value) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        nftItem.element.style.display = "block";
                    } else {
                        nftItem.element.style.display = "none";
                    }
                }
            };
                        const label = document.createElement("label");
                        label.textContent = attribute.trait_info.trait;
                        label.htmlFor = attribute.trait_info.trait;
                        radioCategory.appendChild(radio);
                        radioCategory.appendChild(label);
                    }
                }
            }
        }
        filterRadios.appendChild(radioCategory);
    }
});
