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
import { core, additional } from "./list-options";
import { useState } from "react";
import EducationModal from "./education-modal";
import AboutMeModal from "./about-modal";

export default function AddProfileSectionModal({ open, close }) {
  const [eduModal, setEduModal] = useState(false);
  const [workModal, setWorkModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);

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
              <Accordion>
                <AccordionSummary>
                  <Typography
                    level="title-lg"
                    sx={{ fontFamily: "Roboto Condensed" }}
                  >
                    Core
                  </Typography>
                </AccordionSummary>
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
              </Accordion>

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
      />
    </>
  );
}
