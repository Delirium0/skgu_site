import React from "react";
import cl from "./Footer.module.css";
import homeIcon from "./home-icon-silhouette-svgrepo-com.svg";
import accuntIcon from "./account-svgrepo-com.svg";
import searchIcon from "./search-svgrepo-com.svg";

const Footer = () => {
  return (
    <div className={cl.footer_container}>
      <div className={cl.home_block}>
        <img className={cl.footer_home_image} src={homeIcon} alt="Home icon" />
      </div>

      <div className={cl.home_block}>
        <img
          className={cl.footer_home_image}
          src={searchIcon}
          alt="search icon"
        />
      </div>
      <div className={cl.home_block}>
        <img
          className={cl.footer_home_image}
          src={accuntIcon}
          alt="account icon"
        />
      </div>
    </div>
  );
};

export default Footer;
