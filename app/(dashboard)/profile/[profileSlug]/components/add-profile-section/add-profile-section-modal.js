"use client";
import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Box,
  AccordionGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemDecorator,
} from "@mui/joy";
import { core, additional, coreBrands, additionalBrands } from "./list-options";
import { useState } from "react";
import EducationModal from "../modals/normal/education-modal";
import AboutMeModal from "../modals/about-modal";
import WebsiteAdderModal from "../modals/brands/add-website-modal";
import IndustryAdderModal from "../modals/brands/industry-modal";
import CompanyhQModal from "../modals/brands/company&hq-modal";
import PositionModal from "../modals/normal/position-modal";

export default function AddProfileSectionModal({
  open,
  close,
  type,
  requestedBy,
}) {
  const [eduModal, setEduModal] = useState(false);
  const [workModal, setWorkModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [webModal, setWebModal] = useState(false);
  const [indModal, setIndModal] = useState(false);
  const [comphqModal, setComphqModal] = useState(false);

  const handleCoreClick = (name) => {
    if (name === "Add Education") {
      setEduModal(true);
    } else if (name === "Add Position") {
      setWorkModal(true);
    } else if (name === "Skills") {
      setSkillModal(true);
    } else if (name == "About me") {
      setAboutModal(true);
    }
  };

  const handleBrandClick = (name) => {
    if (name === "Overview") {
      setAboutModal(true);
    } else if (name === "Website") {
      setWebModal(true);
    } else if (name === "Industry") {
      setIndModal(true);
    } else if (name == "Company Size and Headquarters") {
      setComphqModal(true);
    }
  };

  return (
    <>
      <Modal open={open} onClose={close}>
        <ModalDialog sx={{ width: 400 }}>
          <ModalClose />
          <Box className="header" sx={{ position: "sticky" }}>
            <Typography sx={{ fontFamily: "Roboto Condensed" }} level="h3">
              Add to Profile
            </Typography>
          </Box>

          <Box className="options">
            <AccordionGroup>
              {/* Core */}
              <Accordion>
                <AccordionSummary>
                  <Typography
                    level="title-lg"
                    sx={{ fontFamily: "Roboto Condensed" }}
                  >
                    Core
                  </Typography>
                </AccordionSummary>

                {type === "normal" ? (
                  <AccordionDetails>
                    <List>
                      {core.map((items, index) => {
                        return (
                          <ListItemButton
                            key={index}
                            onClick={() => {
                              handleCoreClick(items.name);
                            }}
                          >
                            <ListItemDecorator>{items.icon}</ListItemDecorator>
                            <Typography sx={{ fontFamily: "Roboto Condensed" }}>
                              {items.name}
                            </Typography>
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                ) : null}

                {type === "brand" ? (
                  <AccordionDetails>
                    <List>
                      {coreBrands.map((items, index) => {
                        return (
                          <ListItemButton
                            key={index}
                            onClick={() => {
                              handleBrandClick(items.name);
                            }}
                          >
                            <ListItemDecorator>{items.icon}</ListItemDecorator>
                            <Typography sx={{ fontFamily: "Roboto Condensed" }}>
                              {items.name}
                            </Typography>
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                ) : null}
              </Accordion>

              {/* Additional */}
              <Accordion>
                <AccordionSummary>
                  {" "}
                  <Typography
                    level="title-lg"
                    sx={{ fontFamily: "Roboto Condensed" }}
                  >
                    Additional
                  </Typography>
                </AccordionSummary>

                {type === "normal" ? (
                  <AccordionDetails>
                    <List>
                      {additional.map((items, index) => {
                        return (
                          <ListItemButton key={index}>
                            <ListItemDecorator>{items.icon}</ListItemDecorator>
                            <Typography sx={{ fontFamily: "Roboto Condensed" }}>
                              {items.name}
                            </Typography>
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                ) : null}
                {type === "brand" ? (
                  <AccordionDetails>
                    <List>
                      {additionalBrands.map((items, index) => {
                        return (
                          <ListItemButton key={index}>
                            <ListItemDecorator>{items.icon}</ListItemDecorator>
                            <Typography sx={{ fontFamily: "Roboto Condensed" }}>
                              {items.name}
                            </Typography>
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                ) : null}
              </Accordion>
            </AccordionGroup>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Modals */}
      <EducationModal
        open={eduModal}
        close={() => {
          setEduModal(false);
        }}
      />
      <AboutMeModal
        open={aboutModal}
        close={() => {
          setAboutModal(false);
        }}
        type={type === "normal" ? "normal" : "brand"}
      />

      <WebsiteAdderModal
        open={webModal}
        close={() => {
          setWebModal(false);
        }}
        owner={requestedBy}
      />
      <IndustryAdderModal
        open={indModal}
        close={() => {
          setIndModal(false);
        }}
        owner={requestedBy}
      />
      <CompanyhQModal
        open={comphqModal}
        close={() => {
          setComphqModal(false);
        }}
        owner={requestedBy}
      />

      <PositionModal
        open={workModal}
        close={() => {
          setWorkModal(false);
        }}
      />
    </>
  );
}
