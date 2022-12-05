import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import search from "../assets/search.svg";
import close from "../assets/close.svg";
import { Backdrop, Box, ClickAwayListener, Fade, IconButton } from "@mui/material";
import { animationTimeout } from "../const";
import { SearchResults } from "../components/SearchResults";
import { DevExamples } from "./DevExamples";
import { AppButton } from "./AppButton";
import { CenteringBox } from "./Common.styled";
import { useAddressInput } from "../lib/useAddressInput";

const InputWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: 48,
  background: "#F7F9FB",
  borderRadius: 40,
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  padding: "0 10px 0 20px",
  zIndex: 9,
});

const AppAddressInput = styled("input")(({ theme }) => ({
  flex: 1,
  marginLeft: 10,
  width: "100%",
  height: 48,
  fontSize: 16,
  fontWeight: 500,
  outline: "unset",
  fontFamily: "Mulish",
  color: "#000",
  border: "none",
  background: "transparent",
  caretColor: "#728A96",
  "&::placeholder": {
    color: "#728A96",
    fontWeight: 500,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
  },
}));

export interface SearchRequest {
  index: number;
  value: string;
}

export function AddressInput() {
  const {
    onSubmit,
    onItemDelete,
    onItemClick,
    onHistoryClear,
    onClear,
    active,
    searchResults,
    value,
    setActive,
    setValue,
    onItemAdd,
  } = useAddressInput();
  const location = useLocation();
  const [urlParams] = useSearchParams();
  const showDevExamples = urlParams.get("devExamples") !== null;

  useEffect(() => {
    onHistoryClear();
  }, []);

  useEffect(() => {
    onItemAdd(location.pathname.slice(1, location.pathname.length));
  }, [location.pathname]);

  useEffect(() => {
    const listener = (e: any) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        onSubmit();
        e.target.blur();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [value]);

  return (
    <ClickAwayListener onClickAway={() => setActive(false)}>
      <>
        <Box sx={{ position: "relative", maxWidth: 1160, width: "100%", zIndex: 3 }}>
          <InputWrapper>
            <img width={24} height={24} src={search} alt="Search icon" />
            <AppAddressInput
              placeholder="Contract address"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onSubmit={onSubmit}
              onFocus={() => setActive(true)}
              spellCheck={false}
            />
            <Fade in={!!value} timeout={animationTimeout}>
              <CenteringBox>
                <IconButton onClick={onClear}>
                  <img src={close} width={16} height={16} alt="Close icon" />
                </IconButton>
                <AppButton
                  height={34}
                  width={40}
                  textColor="#fff"
                  background="rgb(0, 136, 204)"
                  hoverBackground="rgb(0, 95, 142)"
                  fontWeight={600}
                  onClick={onSubmit}>
                  Go
                </AppButton>
              </CenteringBox>
            </Fade>
          </InputWrapper>
          {active && !!searchResults.length && (
            <SearchResults
              searchResults={searchResults}
              onItemClick={onItemClick}
              onItemDelete={onItemDelete}
              onHistoryClear={onHistoryClear}
            />
          )}
          {(showDevExamples || import.meta.env.DEV) && active && <DevExamples />}
        </Box>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: 1,
            overflow: "hidden",
          }}
          invisible={!searchResults.length}
          open={active}
          onClick={() => setActive(false)}
        />
      </>
    </ClickAwayListener>
  );
}
