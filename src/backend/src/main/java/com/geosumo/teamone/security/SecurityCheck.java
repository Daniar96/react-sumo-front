package com.geosumo.teamone.security;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.ws.rs.NameBinding;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import static java.lang.annotation.ElementType.METHOD;

@NameBinding
@Retention(RUNTIME)
@Target({ TYPE, METHOD })
public @interface SecurityCheck {

}
