fetch("metadata/metadata.json")
  .then((response) => response.json())
  .then((nftItems) => {
    const uniqueTraits = new Set()
    const filterCheckboxs = document.querySelector(".filter")

    for (const nftItem of nftItems) {
      for (const attribute of nftItem.attributes) {
        uniqueTraits.add(attribute.trait_category)
      }
    }

    // Generate filter component
    for (const traitCategory of uniqueTraits) {
      const totalCheckboxesOfCategory = document.createElement("div")
      const checkboxCategory = document.createElement("div")
      const categoryTitle = document.createElement("button")

      totalCheckboxesOfCategory.id = "totalCheckboxesOfCategory"

      checkboxCategory.id = traitCategory
      checkboxCategory.classList = "traitCategoryContent"
      checkboxCategory.style.display = "none"

      categoryTitle.id = "categoryTitle"
      categoryTitle.textContent = traitCategory

      categoryTitle.onclick = () => {
        // Hides and show checboxes for trait options within each category on click
        const traitCategoryForDisplay = document.getElementById(traitCategory)
        traitCategoryForDisplay.style.display = traitCategoryForDisplay.style.display === "none" ? "block" : "none"
      }

      totalCheckboxesOfCategory.appendChild(categoryTitle)
      totalCheckboxesOfCategory.appendChild(checkboxCategory)

      for (const nftItem of nftItems) {
        for (const attribute of nftItem.attributes) {
          if (attribute.trait_category === traitCategory) {
            let found = false
            for (const checkbox of checkboxCategory.querySelectorAll("input[type=checkbox]")) {
              if (checkbox.value === attribute.trait_info.trait) {
                found = true
                break
              }
            }
            // If trait is not present in checkboxCategory, add it
            if (!found) {
              const optionDiv = document.createElement("div")
              const checkbox = document.createElement("input")
              const checkboxId = `${attribute.trait_category} ${attribute.trait_info.trait} checkbox`

              optionDiv.classList = "trait"
              checkbox.type = "checkbox"
              checkbox.name = `trait-option ${attribute.trait_category}`
              checkbox.id = checkboxId
              checkbox.value = attribute.trait_info.trait
              checkbox.dataset.category = attribute.trait_category
              
              checkbox.onchange = () => {
                // Uncheck all checkboxes in the same category as the currently clicked checkbox, except for the currently clicked checkbox
                const category = checkbox.dataset.category
                const otherCheckboxes = document.querySelectorAll(`input[data-category="${category}"]`)
                for (const cb of otherCheckboxes) {
                  if (cb !== checkbox) {
                    cb.checked = false
                  }
                }
              
                // Get all selected traits
                const selectedTraits = []
                const allCheckboxes = document.querySelectorAll("input[type=checkbox]")
                for (const cb of allCheckboxes) {
                  if (cb.checked) {
                    selectedTraits.push({
                      trait: cb.value,
                      trait_category: cb.dataset.category,
                    })
                  }
                }
              
                let noNFTsFound = true
                for (const nftItem of nftItems) {
                  let found = true
                  for (const trait of selectedTraits) {
                    let traitFound = false
                    for (const attribute of nftItem.attributes) {
                      if (attribute.trait_info.trait === trait.trait && attribute.trait_category === trait.trait_category) {
                        traitFound = true
                        break
                      }
                    }
                    if (!traitFound) {
                      found = false
                      break
                    }
                  }
                  const nftItemEl = document.getElementById(`${nftItem.name} ${nftItem.id} nftItem`)
                  if (found) {
                    nftItemEl.style.display = "block"
                    noNFTsFound = false
                  } else {
                    nftItemEl.style.display = "none"
                  }
                }
              
                // If no NFTs are found with the selected traits, display a message
                const noNFTsFoundEl = document.getElementById("noFoundNFT")
                if (noNFTsFound) {
                  noNFTsFoundEl.style.display = "block"
                } else {
                  noNFTsFoundEl.style.display = "none"
                }
              }

              const label = document.createElement("label")
              
              label.textContent = `${attribute.trait_info.trait} (${attribute.trait_info.occurrences})`
              label.htmlFor = `${attribute.trait_category} ${attribute.trait_info.trait} checkbox`
              optionDiv.appendChild(checkbox)
              optionDiv.appendChild(label)
              checkboxCategory.appendChild(optionDiv)
            }
          }
        }
      }
      filterCheckboxs.appendChild(totalCheckboxesOfCategory)
    }

    for (const nftItem of nftItems) {
      const nftImage = document.createElement("img")
      const nftName = document.createElement("p")
      const nftID = document.createElement("span")
      const nftRank = document.createElement("p")
      const nftItemContainer = document.createElement("button")

      nftImage.setAttribute("src", nftItem.image)
      nftName.textContent = nftItem.name
      nftRank.textContent = `Rank ${nftItem.rank}`

      if (nftItem.id !== "#undefined") {
        nftID.textContent = ` (${nftItem.id})`
      }

      nftName.style.fontWeight = "bold"
      nftRank.style.color = "#69BF40"

      const nftItemId = `${nftItem.name} ${nftItem.id} nftItem`
      nftItemContainer.classList.add("nft-item")
      nftItemContainer.id = nftItemId
      nftItemContainer.appendChild(nftImage)
      nftName.appendChild(nftID)
      nftName.appendChild(nftRank)
      nftItemContainer.appendChild(nftName)
      document.querySelector(".nft-container").appendChild(nftItemContainer)

      nftItemContainer.addEventListener("click", function() {
        const nftInfoOverlay = document.createElement("div")
        const nftBox = document.createElement("div")
        const textContentBox = document.createElement("div")

        const nftImg = document.createElement("img")
        const nftTitle = document.createElement("h1")
        const nftRankP = document.createElement("h3")
        const traitBox = document.createElement("div")

        const buyButtons = document.createElement("div")
        const magicEdenBuy = document.createElement("a")
        const hyperSpaceBuy = document.createElement("a")

        buyButtons.appendChild(magicEdenBuy)
        buyButtons.appendChild(hyperSpaceBuy)

        magicEdenBuy.textContent = "Magic Eden"
        hyperSpaceBuy.textContent = "Hyper Space"

        buyButtons.classList.add("buyButtonContainer")
        magicEdenBuy.classList.add("buyButton")
        hyperSpaceBuy.classList.add("buyButton")

        magicEdenBuy.href = `https://magiceden.io/item-details/${nftItem.mintAddress}`
        hyperSpaceBuy.href = `https://hyperspace.xyz/token/${nftItem.mintAddress}`

        magicEdenBuy.target = "_blank"
        hyperSpaceBuy.target = "_blank"

        for (const traitCategory of nftItem.attributes) {
          const traitCategoryDiv = document.createElement("div")
          const traitInfo = document.createElement("p")
            
          traitInfo.innerHTML = `<p style="color: #9BD382"><span style="font-weight: bold color: #BDF9A1">${traitCategory.trait_category}:</span> ${traitCategory.trait_info.trait} | Rarity: ${traitCategory.trait_info.rarity.toFixed(2)}%</span>`
          traitBox.appendChild(traitCategoryDiv)
          traitCategoryDiv.appendChild(traitInfo)
        }

        if (nftItem.id === "#undefined") {
          nftTitle.textContent = `${nftItem.name}`
        } else {
          nftTitle.textContent = `${nftItem.name} ${nftItem.id}`
        }

        nftImg.setAttribute("src", nftItem.image)
        nftRankP.textContent = `Rank ${nftItem.rank}`

        nftInfoOverlay.appendChild(nftBox)
        nftBox.appendChild(nftImg)
        nftBox.appendChild(textContentBox)
        textContentBox.appendChild(nftTitle)
        textContentBox.appendChild(nftRankP)
        textContentBox.appendChild(traitBox)
        textContentBox.appendChild(buyButtons)

        nftInfoOverlay.classList.add("nft-info")

        nftBox.classList.add("nftBox")
        nftImg.classList.add("infoImg")
        textContentBox.classList.add("textContentBox")

        nftInfoOverlay.style.display = "block"

        nftInfoOverlay.addEventListener("click", function() {
          nftInfoOverlay.style.display = "none"
        })

        document.querySelector(".nftInfocontainer").appendChild(nftInfoOverlay)
      })
    }
  })