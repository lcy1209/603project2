package com.example.hansei.security.user;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.hansei.entity.HanUser;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
public class CustomUser implements UserDetails {

    private HanUser user;

    public CustomUser(HanUser user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));
        log.debug("User authorities: {}", authorities);
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getLoginid();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부를 관리하지 않으므로 true 반환
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금 여부를 관리하지 않으므로 true 반환
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 비밀번호 만료 여부를 관리하지 않으므로 true 반환
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화 여부를 관리하지 않으므로 true 반환
    }

    @Override
    public String toString() {
        return "CustomUser{" +
                "username=" + getUsername() +
                ", authorities=" + getAuthorities() +
                "}";
    }
}
