package dev.aulait.svqk.interfaces.issue;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import lombok.Data;

@Data // <.>
public class IssueStatusDto {

  // <.>
  @Schema(required = true, readOnly = true)
  private String id;

  @Schema(required = true)
  private String name;

  @Schema(required = true, readOnly = true)
  private long version;
}