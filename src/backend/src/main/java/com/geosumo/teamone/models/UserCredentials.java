package com.geosumo.teamone.models;

import com.fasterxml.jackson.annotation.JsonRawValue;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class UserCredentials {
    @JsonRawValue
    private String username;

    @JsonRawValue
    private String password;

    public UserCredentials() {
    }

    public UserCredentials(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String pswrd) {
        this.password = pswrd;
    }

}