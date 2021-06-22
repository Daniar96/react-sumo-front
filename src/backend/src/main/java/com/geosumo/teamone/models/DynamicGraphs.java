package com.geosumo.teamone.models;

import com.fasterxml.jackson.annotation.JsonRawValue;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DynamicGraphs {
    @JsonRawValue
    private String slowest;

    @JsonRawValue
    private String busiest;

    public DynamicGraphs() {
    }

    public DynamicGraphs(String slowest, String busiest) {
        this.slowest = slowest;
        this.busiest = busiest;
    }

    public String getSlowest() {
        return slowest;
    }

    public void setSlowest(String slowest) {
        this.slowest = slowest;
    }

    public String getBusiest() {
        return busiest;
    }

    public void setBusiest(String busiest) {
        this.busiest = busiest;
    }
}
