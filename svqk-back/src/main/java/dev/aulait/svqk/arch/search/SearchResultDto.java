package dev.aulait.svqk.arch.search;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dev.aulait.svqk.arch.util.ReflectionUtils;
import java.util.List;
import java.util.stream.LongStream;

import lombok.Data;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchResultDto<T> {

  @Schema(required = true)
  private List<T> list;

  @Schema(required = true)
  private long count;

  @Schema(required = true)
  private int limit;

  @Schema(required = true)
  private int start;

  @Schema(required = true)
  public long getEnd() {
    return Math.min(getStart() + limit - 1, count);
  }

  @Schema(required = true)
  public int getLastPage() {
    return (int) Math.max(Math.ceil((double) count / limit), 0);
  }

  @Schema(required = true)
  public long[] getPageNums() {
    if (list == null || list.isEmpty()) {
      return new long[] {};
    }
    return LongStream.rangeClosed(1, getLastPage()).toArray();
  }

  public static <T, S extends SearchResultDto<T>> S build(
      SearchConditionVo condition, SearchResultVo<?> result, List<T> list, Class<S> type) {

    S dto = ReflectionUtils.newInstance(type);

    dto.setList(list);
    dto.setCount(result.getCount());
    dto.setStart(result.getCount() < 1 ? 0 : condition.getOffset() + 1);
    dto.setLimit(condition.getPageSize());

    return dto;
  }
}